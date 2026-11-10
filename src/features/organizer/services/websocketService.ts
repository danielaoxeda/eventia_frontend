import { Client, IMessage, Frame } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://localhost:8080/ws-eventia";

export interface LiveSaleNotification {
  organizerId: number;
  eventTitle: string;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  buyerName: string;
  message: string;
  timestamp: string;
  updatedDashboard?: any;
}

type OnNotificationHandler = (notification: LiveSaleNotification) => void;

class OrganizerWebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, () => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: any = null;
  private isConnecting = false;

  connect(authToken: string, organizerId: number): void {
    if (this.client?.connected || this.isConnecting) return;

    this.isConnecting = true;

    const socket = new SockJS(WS_URL);
    this.client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
      debug: (msg) => {
        if (import.meta.env.DEV) console.log("[STOMP]", msg);
      },
      onConnect: (frame: Frame) => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        console.log("[STOMP] Conectado al broker de eventos (session=", frame.headers["session"] ?? "?", ")");

        // Suscribirse al topic del dashboard del organizador autenticado
        const destination = `/topic/organizers/${organizerId}/dashboard`;
        this.subscribe(destination, (notification) => {
          this.onNotification?.(notification);
        });
      },
      onStompError: (frame: Frame) => {
        this.isConnecting = false;
        console.error("[STOMP] Error del broker:", frame.headers["message"]);
        this.scheduleReconnect(authToken, organizerId);
      },
      onWebSocketError: (event: Event) => {
        this.isConnecting = false;
        console.error("[STOMP] Error de WebSocket:", event);
        this.scheduleReconnect(authToken, organizerId);
      },
      onDisconnect: () => {
        this.isConnecting = false;
        console.log("[STOMP] Desconectado del broker de eventos");
      },
    });

    this.client.activate();
  }

  private subscribe(destination: string, handler: OnNotificationHandler): () => void {
    if (!this.client) return () => {};

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const notification: LiveSaleNotification = JSON.parse(message.body);
        handler(notification);
      } catch (err) {
        console.error("[STOMP] Error parseando notificación:", err);
      }
    });

    const unsubscribe = () => {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    };
    this.subscriptions.set(destination, unsubscribe);
    return unsubscribe;
  }

  private scheduleReconnect(authToken: string, organizerId: number): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn("[STOMP] Máximo de reintentos alcanzado. No se reconectará automáticamente.");
      return;
    }
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimeout = setTimeout(() => {
      console.log(`[STOMP] Reconectando (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect(authToken, organizerId);
    }, delay);
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // evitar reconexión automática
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.clear();
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.isConnecting = false;
  }

  get connected(): boolean {
    return this.client?.connected ?? false;
  }

  // Callback inyectado desde el hook
  onNotification?: OnNotificationHandler;
}

export const organizerWebSocket = new OrganizerWebSocketService();
