import { Link } from "react-router-dom";
import { useOrganizerDashboard } from "../hooks/useOrganizerDashboard";
import DashboardKpiGrid from "../components/dashboard/DashboardKpiGrid";
import SalesChart from "../components/dashboard/SalesChart";

export default function OrganizerDashboardPage() {
  const { data, loading, refreshing, loadData } = useOrganizerDashboard();

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
        <span className="text-xs font-semibold text-outline">Cargando dashboard y métricas...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
        <span className="material-symbols-outlined text-outline text-5xl">error_outline</span>
        <p className="text-sm text-outline font-medium">No se pudieron cargar los datos del dashboard.</p>
        <button onClick={loadData} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-outline font-medium">Eventia</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">Dashboard & Métricas</h1>
          <p className="text-xs text-on-surface-variant max-w-3xl">
            KPIs comerciales, ventas y ocupación. La gestión de tus eventos está en el módulo <strong>Mis Eventos</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
            <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
          </button>
          <Link to="/organizador/eventos" className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>Mis Eventos</span>
          </Link>
        </div>
      </div>

      <DashboardKpiGrid kpis={data.kpis} />
      <SalesChart dailySales={data.dailySales} zoneDistribution={data.zoneDistribution} />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-on-surface">Mis Eventos</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Listado, creación, edición, eliminación lógica y entradas se gestionan en su módulo.</p>
        </div>
        <Link to="/organizador/eventos" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold">
          Ir a Mis Eventos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
