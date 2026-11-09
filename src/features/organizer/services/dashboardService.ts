import apiClient from "../../../shared/services/api";
import type { OrganizerDashboardData } from "../types/organizer.types";
import { USE_MOCK_DATA, MOCK_EVENTS, MOCK_DAILY_SALES } from "./organizerMock";
import { mapApiDashboardToOrganizer, type ApiOrganizerDashboard } from "./organizerMappers";

export const dashboardService = {
  async getDashboardData(): Promise<OrganizerDashboardData> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 120));
      const activeEventsList = MOCK_EVENTS.filter((e) => e.active && e.status !== "draft");
      const totalTicketsSold = activeEventsList.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);
      const totalCapacity = activeEventsList.reduce((acc, e) => acc + (e.capacity || 0), 0);
      const totalRevenuePEN = activeEventsList.reduce((acc, e) => acc + (e.totalRevenue || 0), 0);
      const occupancyRate = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;
      return {
        kpis: {
          activeEvents: activeEventsList.length,
          activeEventsChange: 14.3,
          ticketsSold: totalTicketsSold,
          ticketsSoldChange: 22.8,
          totalRevenuePEN,
          totalRevenueChange: 18.5,
          occupancyRate,
          occupancyRateChange: 6.2,
        },
        dailySales: MOCK_DAILY_SALES,
        zoneDistribution: [
          { zoneName: "Campo VIP Platinum", soldCount: 3850, totalCapacity: 4000, percentage: 96, color: "#3525cd" },
          { zoneName: "Campo General", soldCount: 6200, totalCapacity: 7000, percentage: 88, color: "#571ac0" },
          { zoneName: "Tribuna Oriente / Occidente", soldCount: 2550, totalCapacity: 4000, percentage: 63, color: "#4f46e5" },
        ],
        recentEvents: MOCK_EVENTS,
        activeShift: {
          venue: MOCK_EVENTS[0]?.venue || "Arena 1 Costa Verde",
          gateSystemStatus: "online",
          generalCapacityWarning: "Capacidad general al 84%",
        },
      };
    }

    const response = await apiClient.get<ApiOrganizerDashboard>("/api/organizer/dashboard");
    return mapApiDashboardToOrganizer(response.data);
  },
};
