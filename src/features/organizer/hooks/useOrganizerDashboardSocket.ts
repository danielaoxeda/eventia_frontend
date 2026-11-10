import { useEffect, useRef, useState, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import type { OrganizerDashboardData, OrganizerLiveSaleNotification } from "../types/organizer.types";
import { mapApiDashboardToOrganizer, type ApiOrganizerDashboard } from "../services/organizerMappers";

// Construye la URL de WebSocket nativa: http://64.236.240.204:8080 -> ws://64.236.240.204:8080/ws-eventia
const API_URL = import.meta.env.VITE_API_URL || "http://64.236.240.204:8080";
const WS_URL = API_URL.replace(/^http/, "ws") + "/ws-eventia";

interface UseOrganizerDashboardSocketProps {
  organizerId?: number | string;
  onLiveSale?: (notification: OrganizerLiveSaleNotification) => void;
  onDashboardUpdate?: (data: OrganizerDashboardData) => void;
}

export function useOrganizerDashboardSocket({
  organizerId,
  onLiveSale,
  onDashboardUpdate,
}: UseOrganizerDashboardSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<OrganizerLiveSaleNotification | null>(null);
  const clientRef = useRef<Client | null>(null);

  const handleMessage = useCallback(
    (message: IMessage) => {
      try {
        const payload = JSON.parse(message.body);
        console.log("[Eventia STOMP] 🔔 Mensaje recibido en tiempo real:", payload);

        let mappedDashboard: OrganizerDashboardData | undefined = undefined;
        if (payload.updatedDashboard) {
          mappedDashboard = mapApiDashboardToOrganizer(payload.updatedDashboard as ApiOrganizerDashboard);
        }

        const notification: OrganizerLiveSaleNotification = {
          organizerId: payload.organizerId,
          eventTitle: payload.eventTitle || "Evento",
          ticketTypeName: payload.ticketTypeName || "Entrada General",
          quantity: payload.quantity || 1,
          unitPrice: payload.unitPrice || 0,
          subtotal: payload.subtotal || 0,
          buyerName: payload.buyerName || "Comprador",
          message: payload.message || "Nueva venta registrada",
          timestamp: payload.timestamp || new Date().toISOString(),
          updatedDashboard: mappedDashboard,
        };

        setLastNotification(notification);

        if (onLiveSale) {
          onLiveSale(notification);
        }

        if (mappedDashboard && onDashboardUpdate) {
          onDashboardUpdate(mappedDashboard);
        }
      } catch (err) {
        console.error("[Eventia STOMP] Error al parsear mensaje de WebSocket:", err);
      }
    },
    [onLiveSale, onDashboardUpdate]
  );

  useEffect(() => {
    if (!organizerId) return;

    console.log(`[Eventia STOMP] 🔌 Conectando WebSocket nativo en: ${WS_URL} para organizador id=${organizerId}...`);

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug("[Eventia STOMP Debug]", str);
        }
      },
      onConnect: () => {
        console.log(`[Eventia STOMP] ✅ Conexión establecida con éxito al broker`);
        setIsConnected(true);

        const topic = `/topic/organizers/${organizerId}/dashboard`;
        console.log(`[Eventia STOMP] 📡 Suscribiéndose al canal: ${topic}`);

        client.subscribe(topic, handleMessage);
      },
      onDisconnect: () => {
        console.log("[Eventia STOMP] 🔌 Desconectado del broker STOMP");
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("[Eventia STOMP] ❌ Error en broker STOMP:", frame.headers["message"], frame.body);
        setIsConnected(false);
      },
      onWebSocketClose: () => {
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("[Eventia STOMP] 🛑 Limpiando conexión WebSocket al desmontar...");
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setIsConnected(false);
    };
  }, [organizerId, handleMessage]);

  const clearLastNotification = useCallback(() => {
    setLastNotification(null);
  }, []);

  return {
    isConnected,
    lastNotification,
    clearLastNotification,
  };
}
