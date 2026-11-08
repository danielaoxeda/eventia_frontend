import { useState } from "react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import type { ActiveEventResponse } from "../types/admin.types";
import { calculatePercentage, formatThousands } from "../utils/adminFormatters";

interface ActiveEventsTableProps {
  events: ActiveEventResponse[];
}

export default function ActiveEventsTable({ events }: ActiveEventsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalCount = events.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = events.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: ActiveEventResponse["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Publicado
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-fixed/50 text-primary border border-primary-fixed/60">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Pendiente
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant/40">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Borrador
          </span>
        );
      case "HIDDEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/40">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Oculto
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Cancelado
          </span>
        );
      case "FINISHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Finalizado
          </span>
        );
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden mt-6">
      {/* Encabezado de la tabla */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant/20 bg-surface-container-lowest">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-on-surface">
            Rendimiento de Eventos Activos
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-0.5">
            Supervisión global de ventas y aforo de los eventos activos en la plataforma
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 text-xs font-semibold text-primary shrink-0 self-start sm:self-auto">
          <Building2 className="w-4 h-4 text-primary" />
          <span>{totalCount} eventos activos</span>
        </div>
      </div>

      {/* Contenido de la tabla con scroll horizontal suave */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-surface-container-low/60 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/20">
              <th className="py-3.5 px-6 font-display">EVENTO / CATEGORÍA</th>
              <th className="py-3.5 px-6 font-display">ORGANIZADOR</th>
              <th className="py-3.5 px-6 font-display min-w-[180px]">ENTRADAS / AFORO</th>
              <th className="py-3.5 px-6 font-display text-center">ESTADO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 text-sm">
            {currentEvents.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs text-on-surface-variant">
                  No existen eventos activos registrados en este momento.
                </td>
              </tr>
            ) : (
              currentEvents.map((evt) => {
                const porcentaje = calculatePercentage(evt.ticketsSold, evt.capacity);
                return (
                  <tr
                    key={evt.id}
                    className="hover:bg-surface-container-low/40 transition-colors duration-150"
                  >
                    {/* Evento & Categoría */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-on-surface text-sm">{evt.title}</div>
                      <div className="text-xs text-on-surface-variant font-medium mt-0.5">
                        {evt.categoryName}
                      </div>
                    </td>

                    {/* Organizador */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-on-surface text-xs sm:text-sm">
                        {evt.organizerName}
                      </div>
                    </td>

                    {/* Entradas / Aforo con Barra de Progreso */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-on-surface">
                          {formatThousands(evt.ticketsSold)} / {formatThousands(evt.capacity)}
                        </span>
                        <span className="text-primary font-bold">{porcentaje}%</span>
                      </div>
                      <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-6 text-center">{getStatusBadge(evt.status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/20 bg-surface-container-lowest text-xs text-on-surface-variant">
        <span>
          Mostrando {totalCount > 0 ? startIndex + 1 : 0} a{" "}
          {Math.min(startIndex + itemsPerPage, totalCount)} de {totalCount} eventos activos
        </span>

        <div className="flex items-center gap-2">
          <span className="font-medium mr-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4 text-on-surface" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Página siguiente"
          >
            <ChevronRight className="w-4 h-4 text-on-surface" />
          </button>
        </div>
      </div>
    </div>
  );
}
