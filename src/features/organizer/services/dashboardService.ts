import apiClient from "../../../shared/services/api";
import type { OrganizerDashboardData, OrganizerLiveSaleNotification } from "../types/organizer.types";
import { mapApiDashboardToOrganizer, type ApiOrganizerDashboard } from "./organizerMappers";

export const dashboardService = {
  async getDashboardData(): Promise<OrganizerDashboardData> {
    const response = await apiClient.get<ApiOrganizerDashboard>("/api/organizer/dashboard");
    return mapApiDashboardToOrganizer(response.data);
  },

  async simulateSale(params?: {
    eventTitle?: string;
    ticketTypeName?: string;
    quantity?: number;
    unitPrice?: number;
    buyerName?: string;
  }): Promise<OrganizerLiveSaleNotification> {
    const response = await apiClient.post<OrganizerLiveSaleNotification>(
      "/api/organizer/dashboard/simulate-sale",
      null,
      { params }
    );
    return response.data;
  },
};
