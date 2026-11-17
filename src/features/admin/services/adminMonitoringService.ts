import api from "@/shared/services/api";
import type {
  ActiveEventResponse,
  DashboardKpiResponse,
  MonitoringDashboardResponse,
  RevenueTimelineResponse,
  TicketFlowResponse,
} from "../types/admin.types";

export const adminMonitoringService = {
  // Obtiene el resumen completo del panel de monitoreo
  async getDashboardData(): Promise<MonitoringDashboardResponse> {
    console.log("[AdminMonitoring] Consultando metricas del dashboard");
    const { data } = await api.get<MonitoringDashboardResponse>("/api/admin/monitoring");
    return data;
  },

  // Obtiene los 4 KPIs principales del dashboard
  async getKpis(): Promise<DashboardKpiResponse> {
    const { data } = await api.get<DashboardKpiResponse>("/api/admin/monitoring/kpis");
    return data;
  },

  // Obtiene la evolución mensual de ingresos
  async getRevenueTimeline(): Promise<RevenueTimelineResponse[]> {
    const { data } = await api.get<RevenueTimelineResponse[]>(
      "/api/admin/monitoring/revenue-timeline"
    );
    return data;
  },

  // Obtiene el flujo mensual de tickets emitidos
  async getTicketFlow(): Promise<TicketFlowResponse[]> {
    const { data } = await api.get<TicketFlowResponse[]>(
      "/api/admin/monitoring/ticket-flow"
    );
    return data;
  },

  // Obtiene los eventos activos con su nivel de ocupación
  async getActiveEvents(): Promise<ActiveEventResponse[]> {
    const { data } = await api.get<ActiveEventResponse[]>(
      "/api/admin/monitoring/active-events"
    );
    return data;
  },
};
