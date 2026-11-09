import { useEffect, useState } from "react";
import ActiveEventsTable from "../components/ActiveEventsTable";
import KpiCard from "../components/KpiCard";
import MonitoringHeader from "../components/MonitoringHeader";
import RevenueTimelineChart from "../components/RevenueTimelineChart";
import TicketFlowChart from "../components/TicketFlowChart";
import { adminMonitoringService } from "../services/adminMonitoringService";
import type { MonitoringDashboardResponse } from "../types/admin.types";
import { getErrorMessage } from "../utils/apiAdapter";

export default function AdminMonitoringPage() {
  const [data, setData] = useState<MonitoringDashboardResponse | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminMonitoringService
      .getDashboardData()
      .then(setData)
      .catch((e: unknown) => setError(getErrorMessage(e)));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(null);
    adminMonitoringService
      .getDashboardData()
      .then(setData)
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setTimeout(() => setIsRefreshing(false), 600));
  };

  if (!data) {
    if (error) {
      return (
        <div className="py-24 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-error">{error}</p>
        </div>
      );
    }
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-on-surface-variant">
          Cargando métricas en tiempo real...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 space-y-6">
      <MonitoringHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {error && (
        <div className="p-3 text-xs rounded-xl bg-error-container/30 border border-error-container text-error font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        <KpiCard kind="totalRevenue" metric={data.kpis.totalRevenue} />
        <KpiCard kind="processedOrders" metric={data.kpis.processedOrders} />
        <KpiCard kind="issuedTickets" metric={data.kpis.issuedTickets} />
        <KpiCard kind="activeOrganizers" metric={data.kpis.activeOrganizers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTimelineChart data={data.revenueTimeline} />
        <TicketFlowChart data={data.ticketFlow} />
      </div>

      <ActiveEventsTable events={data.activeEvents} />
    </div>
  );
}
