import apiClient from "../../../shared/services/api";
import type { OrganizerDashboardData } from "../types/organizer.types";
import { mapApiDashboardToOrganizer, type ApiOrganizerDashboard } from "./organizerMappers";

export const dashboardService = {
  async getDashboardData(): Promise<OrganizerDashboardData> {
    const response = await apiClient.get<ApiOrganizerDashboard>("/api/organizer/dashboard");
    return mapApiDashboardToOrganizer(response.data);
  },
};
