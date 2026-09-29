import { useOrganizerDashboard } from "../hooks/useOrganizerDashboard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardKpiGrid from "../components/dashboard/DashboardKpiGrid";
import SalesChart from "../components/dashboard/SalesChart";
import EventsTable from "../components/dashboard/EventsTable";

export default function OrganizerDashboardPage() {
  const { data, loading, refreshing, loadData } = useOrganizerDashboard();

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
          sync
        </span>
        <span className="text-xs font-semibold text-outline">
          Cargando panel de control del organizador...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
        <span className="material-symbols-outlined text-outline text-5xl">
          error_outline
        </span>
        <p className="text-sm text-outline font-medium">
          No se pudieron cargar los datos del panel del organizador.
        </p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Encabezado Principal y Acciones */}
      <DashboardHeader refreshing={refreshing} onRefresh={loadData} />

      {/* Grid de Métricas Comerciales */}
      <DashboardKpiGrid kpis={data.kpis} />

      {/* Gráficos de Ventas Diarias y Distribución de Zonas */}
      <SalesChart
        dailySales={data.dailySales}
        zoneDistribution={data.zoneDistribution}
      />

      {/* Tabla de Eventos Recientes */}
      <EventsTable events={data.recentEvents} onRefresh={loadData} />
    </div>
  );
}
