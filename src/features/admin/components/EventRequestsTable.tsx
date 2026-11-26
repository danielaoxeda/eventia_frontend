import { CalendarDays, Check, ChevronLeft, ChevronRight, MapPin, Users, X } from "lucide-react";
import type { AdminEventSummary, PageResponse } from "../types/admin.types";
import { formatDate } from "../utils/adminFormatters";

interface EventRequestsTableProps {
  page: PageResponse<AdminEventSummary>;
  onPageChange: (page: number) => void;
  onApprove: (event: AdminEventSummary) => void;
  onReject: (event: AdminEventSummary) => void;
  busyId: number | null;
}

export default function EventRequestsTable({
  page,
  onPageChange,
  onApprove,
  onReject,
  busyId,
}: EventRequestsTableProps) {
  const currentPage = page.number + 1;
  const totalPages = Math.max(1, page.totalPages);

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-surface-container-low/60 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/20">
              <th className="py-3.5 px-5 font-display">Evento</th>
              <th className="py-3.5 px-5 font-display">Categoría</th>
              <th className="py-3.5 px-5 font-display">Fecha y hora</th>
              <th className="py-3.5 px-5 font-display">Lugar</th>
              <th className="py-3.5 px-5 font-display">Aforo</th>
              <th className="py-3.5 px-5 font-display">Estado</th>
              <th className="py-3.5 px-5 font-display text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 text-sm">
            {page.content.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-on-surface-variant">
                  No hay solicitudes pendientes de revisión.
                </td>
              </tr>
            ) : (
              page.content.map((event) => (
                <tr key={event.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      {event.bannerUrl ? (
                        <img
                          src={event.bannerUrl}
                          alt={event.title}
                          className="w-11 h-11 rounded-lg object-cover border border-outline-variant/30 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-outline shrink-0">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-on-surface text-sm leading-tight truncate">
                          {event.title}
                        </div>
                        <div className="text-xs text-on-surface-variant mt-0.5 font-mono">
                          EVT-{event.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs font-medium">
                      {event.categoryName || "Sin categoría"}
                    </span>
                  </td>

                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="font-semibold text-on-surface">{formatDate(event.date)}</div>
                    <div className="text-xs text-on-surface-variant">
                      {event.startTime?.slice(0, 5) || "—"} hrs
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[180px]">{event.location || "—"}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <Users className="w-3.5 h-3.5" />
                      {event.capacity.toLocaleString("es-PE")}
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Pendiente
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onApprove(event)}
                        disabled={busyId === event.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-700 border border-green-200 hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Aprobar
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(event)}
                        disabled={busyId === event.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-error border border-error-container hover:bg-error-container/20 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
        <span>
          <span className="font-bold text-primary">{page.totalElements}</span> solicitud(es) pendiente(s)
        </span>
        <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => onPageChange(page.number - 1)}
            disabled={page.first}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber - 1)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                currentPage === pageNumber
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(page.number + 1)}
            disabled={page.last}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            Siguiente
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
