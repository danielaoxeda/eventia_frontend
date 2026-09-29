import { Link } from "react-router-dom";
import type { OrganizerEvent } from "../../types/organizer.types";

interface EditEventHeaderProps {
  event: OrganizerEvent;
  statusLabel: string;
  syncing: boolean;
  saving: boolean;
  onSync: () => void;
  onSave: () => void;
}

export default function EditEventHeader({
  event,
  statusLabel,
  syncing,
  saving,
  onSync,
  onSave,
}: EditEventHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <Link
          to="/organizador/dashboard"
          className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          title="Volver al Dashboard"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[0.6875rem] text-outline uppercase tracking-wider">
              Gestión
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span className="text-[0.6875rem] font-semibold text-primary">
              ID: {event.id}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <h1 className="font-display text-xl font-semibold text-on-surface leading-tight">
              Editar Evento: {event.title}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold ${
                event.active
                  ? "bg-surface-container-high text-primary"
                  : "bg-error-container text-error"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  event.active ? "bg-primary animate-pulse" : "bg-error"
                }`}
              />
              {event.active ? statusLabel : "Inactivo"}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas Superiores */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors disabled:opacity-60"
        >
          <span className={`material-symbols-outlined text-[18px] ${syncing ? "animate-spin" : ""}`}>
            sync
          </span>
          <span>{syncing ? "Sincronizando..." : "Sincronizar"}</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-all shadow-sm disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">
            {saving ? "hourglass_empty" : "save"}
          </span>
          <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </div>
    </div>
  );
}
