import type { OrganizerDashboardData } from "../../types/organizer.types";
import KpiCard from "./KpiCard";
import { formatPEN, formatNumber } from "../../utils/organizerFormatters";

interface DashboardKpiGridProps {
  kpis: OrganizerDashboardData["kpis"];
}

export default function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        label="Recaudación Total"
        value={formatPEN(kpis.totalRevenuePEN, false)}
        iconName="payments"
        changeValue={kpis.totalRevenueChange}
        highlight
        currencyHighlight
      />

      <KpiCard
        label="Entradas Emitidas / Vendidas"
        value={formatNumber(kpis.ticketsSold)}
        iconName="confirmation_number"
        changeValue={kpis.ticketsSoldChange}
      />

      <KpiCard
        label="Tasa de Ocupación Global"
        value={`${kpis.occupancyRate}%`}
        iconName="event_seat"
        changeValue={kpis.occupancyRateChange}
        progressBar={{
          current: kpis.ticketsSold,
          max: 40500,
          percentage: kpis.occupancyRate,
          label: "Ocupación vs Aforo Total",
        }}
      />

      <KpiCard
        label="Eventos Activos en Cartelera"
        value={kpis.activeEvents}
        iconName="calendar_month"
        changeValue={kpis.activeEventsChange}
      />
    </div>
  );
}
