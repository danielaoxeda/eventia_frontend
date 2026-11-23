import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/authContext.shared";
import { organizerService } from "../services/organizerService";
import type { OrganizerDashboardData, OrganizerLiveSaleNotification } from "../types/organizer.types";
import { useOrganizerDashboardSocket } from "./useOrganizerDashboardSocket";

export function useOrganizerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [liveSaleToast, setLiveSaleToast] = useState<OrganizerLiveSaleNotification | null>(null);
  const autoDismissTimerRef = useRef<number | null>(null);

  // La petición es pura; los cambios de estado ocurren en los callbacks de la promesa.
  const requestDashboardData = useCallback(() => organizerService.getDashboardData(), []);

  const applyDashboardData = useCallback((res: OrganizerDashboardData) => {
    setData(res);
  }, []);

  const handleDashboardError = useCallback((err: unknown) => {
    console.error("Error loading organizer dashboard:", err);
  }, []);

  const finishLoading = useCallback(() => {
    setLoading(false);
    setRefreshing(false);
  }, []);

  // Acción manual (botón de actualizar): el indicador se activa aquí, fuera del efecto.
  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      applyDashboardData(await requestDashboardData());
    } catch (err) {
      handleDashboardError(err);
    } finally {
      finishLoading();
    }
  }, [requestDashboardData, applyDashboardData, handleDashboardError, finishLoading]);

  useEffect(() => {
    requestDashboardData().then(applyDashboardData, handleDashboardError).finally(finishLoading);
  }, [requestDashboardData, applyDashboardData, handleDashboardError, finishLoading]);

  const clearLiveSaleToast = useCallback(() => {
    if (autoDismissTimerRef.current) {
      window.clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
    setLiveSaleToast(null);
  }, []);

  // Manejo de actualización en tiempo real desde WebSocket
  const handleDashboardUpdate = useCallback((updatedDashboard: OrganizerDashboardData) => {
    console.log("[useOrganizerDashboard] 🔄 Recibida actualización en vivo por WebSocket:", updatedDashboard);
    setData(updatedDashboard);
  }, []);

  const handleLiveSale = useCallback((notification: OrganizerLiveSaleNotification) => {
    if (autoDismissTimerRef.current) {
      window.clearTimeout(autoDismissTimerRef.current);
    }
    setLiveSaleToast(notification);

    // Auto-cierre automático de la notificación después de 7 segundos
    autoDismissTimerRef.current = window.setTimeout(() => {
      setLiveSaleToast(null);
      autoDismissTimerRef.current = null;
    }, 7000);
  }, []);

  useEffect(() => {
    return () => {
      if (autoDismissTimerRef.current) {
        window.clearTimeout(autoDismissTimerRef.current);
      }
    };
  }, []);

  // Hook de WebSocket STOMP
  const { isConnected } = useOrganizerDashboardSocket({
    organizerId: user?.id,
    onDashboardUpdate: handleDashboardUpdate,
    onLiveSale: handleLiveSale,
  });

  // Simulación de venta para pruebas y demostraciones en vivo
  const simulateLiveSale = useCallback(async () => {
    try {
      setSimulating(true);
      const res = await organizerService.simulateSale({
        eventTitle: data?.recentEvents?.[0]?.title || "Lima Live Sessions",
        ticketTypeName: "Campo VIP Platinum",
        quantity: 2,
        unitPrice: 180,
        buyerName: "Cliente Demo en Vivo",
      });
      console.log("[useOrganizerDashboard] Simulación de venta enviada:", res);
      if (res.updatedDashboard) {
        setData(res.updatedDashboard);
      }
    } catch (err) {
      console.error("Error al simular venta:", err);
    } finally {
      setSimulating(false);
    }
  }, [data]);

  return {
    data,
    loading,
    refreshing,
    isConnected,
    liveSaleToast,
    simulating,
    loadData,
    clearLiveSaleToast,
    simulateLiveSale,
  };
}
