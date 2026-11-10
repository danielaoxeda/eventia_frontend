import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { organizerService } from "../services/organizerService";
import { organizerWebSocket } from "../services/websocketService";
import type { OrganizerDashboardData, OrganizerKpi } from "../types/organizer.types";

export function useOrganizerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const initialized = useRef(false);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await organizerService.getDashboardData();
      setData(res);
    } catch (err) {
      console.error("Error loading organizer dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Conectar WebSocket al montar y recibir notificaciones de venta en vivo
  useEffect(() => {
    if (!user || initialized.current) return;
    initialized.current = true;

    const token = localStorage.getItem("accessToken");
    const organizerId = user.id;

    if (!token) {
      setLoading(false);
      return;
    }

    organizerWebSocket.onNotification = (notification) => {
      console.log("[WS] Notificación de venta en vivo recibida:", notification);

      setData((current) => {
        if (!current) return current;

        const kpis = current.kpis as OrganizerKpi;
        const newTicketsSold = (kpis.ticketsSold || 0) + (notification.quantity || 0);
        const newRevenue = (kpis.totalRevenuePEN || 0) + (notification.subtotal || 0);
        const totalCapacity = current.recentEvents.reduce(
          (acc, e) => acc + (e.capacity || 0),
          0
        );
        const newOccupancy =
          totalCapacity > 0 ? Math.round((newTicketsSold / totalCapacity) * 100) : 0;

        return {
          ...current,
          kpis: {
            ...kpis,
            ticketsSold: newTicketsSold,
            totalRevenuePEN: newRevenue,
            occupancyRate: newOccupancy,
          },
          // Insertar la venta más reciente al inicio de dailySales si corresponde
          dailySales: current.dailySales.map((day) => {
            const notifDate = new Date(notification.timestamp).toISOString().slice(0, 10);
            if (day.date === notifDate) {
              return {
                ...day,
                totalPEN: (day.totalPEN || 0) + (notification.subtotal || 0),
                ticketsSold: (day.ticketsSold || 0) + (notification.quantity || 0),
              };
            }
            return day;
          }),
        };
      });
    };

    organizerWebSocket.connect(token, organizerId);

    return () => {
      organizerWebSocket.disconnect();
      initialized.current = false;
    };
  }, [user]);

  useEffect(() => {
    setWsConnected(organizerWebSocket.connected);
  }, [organizerWebSocket.connected]);

  return {
    data,
    loading,
    refreshing,
    wsConnected,
    loadData,
  };
}
