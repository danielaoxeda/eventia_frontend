import { Link } from "react-router-dom";
import type { OrganizerEvent, PageResponse } from "../../types/organizer.types";
import EventStatusBadge from "../common/EventStatusBadge";
import { formatDate } from "../../utils/organizerFormatters";

interface EventsTableProps {
  events: OrganizerEvent[];
  pageData: PageResponse<OrganizerEvent>;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (event: OrganizerEvent) => void;
  onManageTickets: (event: OrganizerEvent) => void;
  onDelete: (event: OrganizerEvent) => void;
}

export default function EventsTable({
  events,
  pageData,
  loading,
  onPageChange,
  onEdit,
  onManageTickets,
  onDelete,
}: EventsTableProps) {
  const currentPage = pageData.number + 1;
  const totalPages = Math.max(1, pageData.totalPages);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-[0.6875rem] uppercase tracking-wider text-outline border-b border-surface-container font-bold">
              <th className="py-3 px-4">Evento</th>
              <th className="py-3 px-4">Lugar</th>
              <th className="py-3 px-4">Fecha y hora</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-xs text-on-surface">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-outline">
                  <span className="material-symbols-outlined text-primary text-2xl animate-spin align-middle">sync</span>
                  <span className="ml-2">Cargando eventos...</span>
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-outline">
                  Aún no tienes eventos. Crea el primero para comenzar.
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr key={evt.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <Link
                        to={`/organizador/eventos/${evt.id}`}
                        className="font-bold text-on-surface text-sm hover:text-primary transition-colors"
                      >
                        {evt.title}
                      </Link>
                      <span className="text-[11px] text-outline font-mono">{evt.code}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">{evt.venue || "—"}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-on-surface">{formatDate(evt.date)}</div>
                    <div className="text-[11px] text-outline">{evt.time || "—"} hrs</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium text-[11px]">
                      {evt.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <EventStatusBadge status={evt.status} active={evt.active} />
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(evt)}
                        title="Editar evento"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onManageTickets(evt)}
                        title="Gestionar tarifas"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(evt)}
                        disabled={!evt.active}
                        title="Eliminar (baja lógica)"
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-surface-container-low border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-outline px-5">
        <span>
          {pageData.totalElements} evento(s) · Página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(pageData.number - 1)}
            disabled={pageData.first}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-semibold disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => onPageChange(pageData.number + 1)}
            disabled={pageData.last}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-semibold disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
