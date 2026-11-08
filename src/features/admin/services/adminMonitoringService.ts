import api from "../../../shared/services/api";
import type {
  ActiveEventResponse,
  DashboardKpiResponse,
  MonitoringDashboardResponse,
  RevenueTimelineResponse,
  TicketFlowResponse,
} from "../types/admin.types";

const ENDPOINT = "/api/v1/admin/monitoring";

/**
 * Servicio del panel de monitoreo. Consume métricas reales calculadas por Spring Boot
 * a partir de las entidades Order, Ticket, User (ORGANIZER) y Event.
 */
export const adminMonitoringService = {
  async getDashboardData(): Promise<MonitoringDashboardResponse> {
    const response = await api.get<MonitoringDashboardResponse>(ENDPOINT);
    return response.data;
  },

  async getKpis(): Promise<DashboardKpiResponse> {
    const response = await api.get<DashboardKpiResponse>(`${ENDPOINT}/kpis`);
    return response.data;
  },

  async getRevenueTimeline(): Promise<RevenueTimelineResponse[]> {
    const response = await api.get<RevenueTimelineResponse[]>(`${ENDPOINT}/revenue-timeline`);
    return response.data;
  },

  async getTicketFlow(): Promise<TicketFlowResponse[]> {
    const response = await api.get<TicketFlowResponse[]>(`${ENDPOINT}/ticket-flow`);
    return response.data;
  },

  async getActiveEvents(): Promise<ActiveEventResponse[]> {
    const response = await api.get<ActiveEventResponse[]>(`${ENDPOINT}/active-events`);
    return response.data;
  },
};
