import { Link } from "react-router-dom";
import type { OrganizerEvent } from "../../types/organizer.types";

interface TicketsHeaderProps {
  events: OrganizerEvent[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateModal: () => void;
}

export default function TicketsHeader({
  events,
  selectedEventId,
  onSelectEvent,
  onOpenCreateModal,
}: TicketsHeaderProps) {
  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/15">
      <div className="flex items-center gap-4">
        <Link
          to="/organizador/dashboard"
          className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors flex-shrink-0"
          title="Volver al Dashboard"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[0.6875rem] text-outline uppercase tracking-wider font-semibold">
              Boletería Comercial
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span className="text-[0.6875rem] font-bold text-primary">
              {currentEvent ? currentEvent.code : "Gestión"}
            </span>
          </div>
          <h1 className="font-display text-xl lg:text-2xl font-bold text-on-surface leading-tight mt-0.5">
            Tarifas y Zonas de Entradas
          </h1>
        </div>
      </div>

      {/* Selector de Evento + Botón de Crear Tarifa */}
      <div className="flex flex-wrap items-center gap-3">
        {events.length > 0 && (
          <div className="relative min-w-[240px]">
            <select
              value={selectedEventId}
              onChange={(e) => onSelectEvent(e.target.value)}
              className="w-full appearance-none bg-surface-container px-3.5 py-2.5 rounded-xl text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-9 border border-outline-variant/20"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.code})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nueva Tarifa / Zona</span>
        </button>
      </div>
    </div>
  );
}
