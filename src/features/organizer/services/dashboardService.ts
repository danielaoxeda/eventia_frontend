import apiClient from "../../../shared/services/api";
import type { OrganizerDashboardData } from "../types/organizer.types";
import { USE_MOCK_DATA, MOCK_EVENTS, MOCK_DAILY_SALES } from "./organizerMock";

export const dashboardService = {
  /**
   * Obtiene la data consolidada del dashboard
   */
  async getDashboardData(): Promise<OrganizerDashboardData> {
    const calculateMetricsFromEvents = (
      eventsList: typeof MOCK_EVENTS,
      salesList: typeof MOCK_DAILY_SALES
    ): OrganizerDashboardData => {
      const activeEventsList = eventsList.filter((e) => e.active && e.status !== "draft");
      const totalTicketsSold = activeEventsList.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);
      const totalCapacity = activeEventsList.reduce((acc, e) => acc + (e.capacity || 0), 0);
      const totalRevenuePEN = activeEventsList.reduce((acc, e) => acc + (e.totalRevenue || 0), 0);
      const occupancyRate =
        totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

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
        dailySales: salesList.length > 0 ? salesList : MOCK_DAILY_SALES,
        zoneDistribution: [
          { zoneName: "Campo VIP Platinum", soldCount: 3850, totalCapacity: 4000, percentage: 96, color: "#3525cd" },
          { zoneName: "Campo General", soldCount: 6200, totalCapacity: 7000, percentage: 88, color: "#571ac0" },
          { zoneName: "Tribuna Oriente / Occidente", soldCount: 2550, totalCapacity: 4000, percentage: 63, color: "#4f46e5" },
        ],
        recentEvents: eventsList,
        activeShift: {
          venue: eventsList[0]?.venue || "Arena 1 Costa Verde",
          gateSystemStatus: "online",
          generalCapacityWarning: "Capacidad general al 84%",
        },
      };
    };

    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 120));
      return calculateMetricsFromEvents(MOCK_EVENTS, MOCK_DAILY_SALES);
    }

    try {
      const [eventsRes, salesRes] = await Promise.all([
        apiClient.get<typeof MOCK_EVENTS>("/events"),
        apiClient.get<typeof MOCK_DAILY_SALES>("/dailySales").catch(() => ({ data: [] })),
      ]);
      return calculateMetricsFromEvents(eventsRes.data || [], salesRes.data || []);
    } catch (err) {
      console.warn("API offline o endpoint no disponible, cargando datos mock locales:", err);
      return calculateMetricsFromEvents(MOCK_EVENTS, MOCK_DAILY_SALES);
    }
  },
};
