import { Link } from "react-router-dom";
import { useOrganizerDashboard } from "../hooks/useOrganizerDashboard";
import DashboardKpiGrid from "../components/dashboard/DashboardKpiGrid";
import SalesChart from "../components/dashboard/SalesChart";

export default function OrganizerDashboardPage() {
  const {
    data,
    loading,
    refreshing,
    isConnected,
    liveSaleToast,
    simulating,
    loadData,
    clearLiveSaleToast,
    simulateLiveSale,
  } = useOrganizerDashboard();

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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-outline font-medium">Eventia</span>

              {/* Píldora de estado del WebSocket */}
              {isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> En vivo (WebSocket STOMP activo)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-surface-container text-outline">
                  <span className="w-2 h-2 rounded-full bg-outline" /> Conectando WebSocket...
                </span>
              )}
          </div>

            <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              Dashboard & Métricas
            </h1>
          <p className="text-xs text-on-surface-variant max-w-3xl">
              KPIs comerciales, ventas y ocupación en tiempo real. La gestión de tus eventos está en el módulo{" "}
              <strong>Mis Eventos</strong>.
          </p>
        </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Botón de Demostración: Simular Venta en Vivo */}
              <button
                type="button"
                onClick={simulateLiveSale}
                disabled={simulating}
                title="Dispara una venta en tiempo real para demostrar la actualización automática por WebSocket"
                className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${simulating ? "animate-spin" : ""}`}>
                  {simulating ? "sync" : "bolt"}
                </span>
                <span>{simulating ? "Transmitiendo..." : "Simular Venta en Vivo"}</span>
              </button>

          <button
            type="button"
            onClick={loadData}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
                <span className={`material-symbols-outlined text-[18px] ${refreshing ? "animate-spin" : ""}`}>
                  refresh
                </span>
            <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
          </button>

                <Link
                  to="/organizador/eventos"
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span>Mis Eventos</span>
          </Link>
        </div>
      </div>

          {/* Banner / Toast de Venta en Tiempo Real */}
          {liveSaleToast && (
            <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                      🔴 Venta en Tiempo Real (STOMP)
                    </span>
                    <span className="text-[11px] text-outline">
                      {new Date(liveSaleToast.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">
                    {liveSaleToast.message}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Comprador: <strong>{liveSaleToast.buyerName}</strong> · Subtotal:{" "}
                    <strong>S/ {Number(liveSaleToast.subtotal).toFixed(2)}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearLiveSaleToast}
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                title="Cerrar notificación"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          )}

      <DashboardKpiGrid kpis={data.kpis} />
      <SalesChart dailySales={data.dailySales} zoneDistribution={data.zoneDistribution} />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-on-surface">Mis Eventos</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Listado, creación, edición, eliminación lógica y entradas se gestionan en su módulo.
              </p>
        </div>
              <Link
                to="/organizador/eventos"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
              >
          Ir a Mis Eventos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
