import { useEffect, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import type { EventNotification } from "../types/organizer.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const WS_URL = API_URL.replace(/^http/, "ws") + "/ws-eventia";

export function useOrganizerEventsSocket(onUpdate: (notification: EventNotification) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const handlerRef = useRef(onUpdate);

  useEffect(() => {
    handlerRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe("/topic/events/updates", (message: IMessage) => {
          try {
            handlerRef.current(JSON.parse(message.body) as EventNotification);
          } catch {
            // mensaje no válido, se ignora
          }
        });
      },
      onDisconnect: () => setIsConnected(false),
      onWebSocketClose: () => setIsConnected(false),
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  return { isConnected };
}
