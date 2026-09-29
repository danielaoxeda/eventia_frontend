import { useState } from "react";
import { Link } from "react-router-dom";
import type { OrganizerEvent } from "../../types/organizer.types";
import EventStatusBadge from "../common/EventStatusBadge";
import { formatPEN, formatNumber, formatDate, calculateOccupancy } from "../../utils/organizerFormatters";

interface EventsTableProps {
  events: OrganizerEvent[];
  onRefresh?: () => void;
}

export default function EventsTable({ events }: EventsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;
    if (filterStatus === "active") return evt.active && evt.status !== "draft" && evt.status !== "inactive";
    if (filterStatus === "inactive") return !evt.active || evt.status === "inactive";
    if (filterStatus === "draft") return evt.status === "draft";
    if (filterStatus === "urgent") return evt.status === "almost_sold_out" || evt.status === "sold_out";

    return true;
  });

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[0.6875rem] font-bold text-outline uppercase tracking-wider">
              SUPERVISIÓN DE CARTELERA
            </span>
            <span className="text-xs text-primary font-bold">
              ({filteredEvents.length} de {events.length})
            </span>
          </div>
          <h2 className="font-display text-lg font-bold text-on-surface">
            Mis Eventos y Conciertos
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre, sede o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low rounded-lg border border-outline-variant/30 text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-surface-container p-0.5 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterStatus === "all"
                ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
                }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("active")}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterStatus === "active"
                ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
                }`}
            >
              En Venta
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("urgent")}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterStatus === "urgent"
                ? "bg-surface-container-lowest text-secondary font-bold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
                }`}
            >
              Casi Agotados
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("inactive")}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterStatus === "inactive"
                ? "bg-surface-container-lowest text-on-surface font-bold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
                }`}
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-[0.6875rem] uppercase tracking-wider text-outline border-b border-surface-container font-bold">
              <th className="py-3 px-4">Evento / Sede</th>
              <th className="py-3 px-4">Fecha & Hora</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Aforo / Ocupación</th>
              <th className="py-3 px-4 text-right">Recaudación</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-xs text-on-surface">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-outline">
                  No se encontraron eventos con los filtros actuales.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => {
                const occupancy = calculateOccupancy(evt.ticketsSold, evt.capacity);
                return (
                  <tr
                    key={evt.id}
                    className="hover:bg-surface-container-low/50 transition-colors group"
                  >
                    {/* Event & Venue */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerUrl}
                          alt={evt.title}
                          className="w-12 h-12 rounded-lg object-cover shadow-xs border border-outline-variant/20 flex-shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {evt.title}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-outline mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            <span>
                              {evt.venue} • {evt.city}
                            </span>
                            <span className="font-mono text-primary-container font-semibold">
                              ({evt.code})
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-on-surface">{formatDate(evt.date)}</div>
                      <div className="text-[11px] text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {evt.time} hrs
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium text-[11px]">
                        {evt.category}
                      </span>
                    </td>

                    {/* Aforo & Progress */}
                    <td className="py-3.5 px-4 min-w-[150px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-on-surface">{formatNumber(evt.ticketsSold)}</span>
                        <span className="text-outline">/ {formatNumber(evt.capacity)}</span>
                        <span className="font-bold text-primary ml-1">{occupancy}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${occupancy >= 90
                            ? "bg-secondary"
                            : occupancy >= 60
                              ? "bg-primary-container"
                              : "bg-tertiary"
                            }`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-sm text-on-surface">
                      {formatPEN(evt.totalRevenue, false)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <EventStatusBadge status={evt.status} active={evt.active} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          to={`/organizador/eventos/${evt.id}/editar`}
                          title="Editar información de evento (RF07)"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </Link>
                        <Link
                          to={`/organizador/eventos/${evt.id}/entradas`}
                          title="Gestionar tarifas y tipos de entrada (RF08-RF10)"
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                        </Link>
                        <Link
                          to={`/evento/${evt.id}`}
                          target="_blank"
                          title="Ver en cartelera pública"
                          className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-xs text-outline px-5">
        <span>Mostrando {filteredEvents.length} eventos registrados</span>
      </div>
    </div>
  );
}
