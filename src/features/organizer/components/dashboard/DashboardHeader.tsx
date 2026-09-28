import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export default function DashboardHeader({
  refreshing,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs text-outline font-medium">Eventia</span>
        </div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          Dashboard General de Eventos
        </h1>
        <p className="text-xs text-on-surface-variant max-w-3xl">
          Centro de control comercial, aforo sincronizado y recaudaciones por canal en soles peruanos.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] ${refreshing ? "animate-spin" : ""}`}>
            refresh
          </span>
          <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
        </button>

        <Link
          to="/organizador/eventos/nuevo"
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Crear Evento</span>
        </Link>
      </div>
    </div>
  );
}
