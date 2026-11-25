import { useEffect, useState } from "react";
import EventRequestsTable from "../components/EventRequestsTable";
import { useAdminRequestsSocket } from "../hooks/useAdminRequestsSocket";
import { adminEventsService } from "../services/adminEventsService";
import type {
  AdminEventSummary,
  EventRequestNotification,
  PageResponse,
} from "../types/admin.types";
import { getErrorMessage } from "../utils/apiAdapter";

const PAGE_SIZE = 7;

const EMPTY_PAGE: PageResponse<AdminEventSummary> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: PAGE_SIZE,
  number: 0,
  first: true,
  last: true,
};

export default function AdminRequestsPage() {
  const [pageData, setPageData] = useState<PageResponse<AdminEventSummary>>(EMPTY_PAGE);
  const [pageIndex, setPageIndex] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [lastRequest, setLastRequest] = useState<EventRequestNotification | null>(null);

  const reload = () => setReloadKey((k) => k + 1);

  const { isConnected } = useAdminRequestsSocket((notification) => {
    setLastRequest(notification);
    reload();
  });

  useEffect(() => {
    let cancelled = false;
    adminEventsService
      .getPendingEvents({ page: pageIndex, size: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setPageData(result);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(getErrorMessage(e));
      });
    return () => {
      cancelled = true;
    };
  }, [pageIndex, reloadKey]);

  const handleApprove = async (event: AdminEventSummary) => {
    setBusyId(event.id);
    try {
      await adminEventsService.approveEvent(event.id);
      reload();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (event: AdminEventSummary) => {
    if (!window.confirm(`¿Rechazar la solicitud de "${event.title}"? El evento quedará cancelado.`)) {
      return;
    }
    setBusyId(event.id);
    try {
      await adminEventsService.rejectEvent(event.id);
      reload();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full pb-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display font-black text-2xl lg:text-3xl text-on-surface tracking-tight">
              Solicitudes de Eventos
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isConnected
                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                  : "bg-surface-container text-outline"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-outline"}`} />
              {isConnected ? "En vivo" : "Conectando..."}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
            Revisa y aprueba los eventos enviados por los organizadores.
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface text-sm font-bold hover:bg-surface-container-highest transition-colors shrink-0 self-start"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Actualizar
        </button>
      </div>

      {lastRequest && (
        <div className="rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 text-xs">
            <span className="material-symbols-outlined text-primary text-[18px]">notifications_active</span>
            <div>
              <p className="font-semibold text-on-surface">{lastRequest.message}</p>
              <p className="text-on-surface-variant mt-0.5">
                {lastRequest.organizerName} · {new Date(lastRequest.timestamp).toLocaleTimeString("es-PE")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLastRequest(null)}
            className="text-outline hover:text-on-surface"
            title="Cerrar aviso"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 text-xs rounded-xl bg-error-container/30 border border-error-container text-error font-medium">
          {error}
        </div>
      )}

      <EventRequestsTable
        page={pageData}
        onPageChange={setPageIndex}
        onApprove={handleApprove}
        onReject={handleReject}
        busyId={busyId}
      />
    </div>
  );
}
