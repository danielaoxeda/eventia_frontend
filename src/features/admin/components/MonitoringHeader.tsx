import { RefreshCw } from "lucide-react";

interface MonitoringHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function MonitoringHeader({
  onRefresh,
  isRefreshing,
}: MonitoringHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-display font-black text-2xl lg:text-3xl text-on-surface tracking-tight">
            Panel de Monitoreo
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
          Métricas y series temporales de la plataforma en tiempo real.
        </p>
      </div>

      {/* Indicador y botón de sincronización */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors shrink-0 self-start sm:self-auto cursor-pointer disabled:opacity-70"
        title="Actualizar datos"
      >
        <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
        <span>Datos sincronizados en tiempo real</span>
      </button>
    </div>
  );
}
