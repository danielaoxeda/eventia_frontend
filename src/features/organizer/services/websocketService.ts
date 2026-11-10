import { Client } from "@stomp/stompjs";

const WS_URL =
  import.meta.env.VITE_WS_URL ?? "ws://64.236.240.204:8080/ws-eventia";

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

    // WebSocket nativo del navegador (sin SockJS, que no es compatible con Vite/ESM)
    const socket = new WebSocket(WS_URL);
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
      debug: (msg: string) => {
        if (import.meta.env.DEV) console.log("[STOMP]", msg);
      },
      onConnect: (frame: any) => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        console.log(
          "[STOMP] Conectado al broker de eventos (session=",
          frame?.headers?.["session"] ?? "?",
          ")"
        );

        const destination = `/topic/organizers/${organizerId}/dashboard`;
        this.subscribe(destination, (notification) => {
          this.onNotification?.(notification);
        });
      },
      onStompError: (frame: any) => {
        this.isConnecting = false;
        console.error("[STOMP] Error del broker:", frame?.headers?.["message"]);
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

    const subscription = this.client.subscribe(destination, (message: any) => {
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
      console.warn(
        "[STOMP] Máximo de reintentos alcanzado. No se reconectará automáticamente."
      );
      return;
    }
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimeout = setTimeout(() => {
      console.log(
        `[STOMP] Reconectando (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      this.connect(authToken, organizerId);
    }, delay);
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts;
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

  onNotification?: OnNotificationHandler;
}

export const organizerWebSocket = new OrganizerWebSocketService();
