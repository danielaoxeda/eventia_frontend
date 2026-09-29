import type { EventStatus } from "../../types/organizer.types";

interface EventPanelProps {
  eventStatus: EventStatus;
  isPublic: boolean;
  onToggleVisibility: () => void;
  onSave: () => void;
  onPreview: () => void;
  onDeactivate: () => void;
  saving?: boolean;
}

export default function EventPanel({
  eventStatus,
  isPublic,
  onToggleVisibility,
  onSave,
  onPreview,
  onDeactivate,
  saving = false,
}: EventPanelProps) {
  const isInactive = eventStatus === "inactive";

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-l-secondary relative overflow-hidden flex flex-col gap-4">

      {/* Visibility Toggle */}
      <div className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-on-surface">Visibilidad en Cartelera</span>
          <span
            className={`text-[0.6875rem] font-semibold ${isInactive
              ? "text-secondary"
              : isPublic
                ? "text-primary"
                : "text-outline"
              }`}
          >
            {isInactive
              ? "Estado: Inactivado por Regla RN04"
              : isPublic
                ? "Estado: Público & Indexado"
                : "Estado: En Pausa (Oculto de público)"}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isPublic && !isInactive}
            onChange={onToggleVisibility}
            disabled={isInactive}
          />
          <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50" />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[20px]">
            {saving ? "hourglass_empty" : "save"}
          </span>
          <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
        </button>

        <button
          type="button"
          onClick={onPreview}
          className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span>Ver Vista Previa Pública</span>
        </button>

        {!isInactive && (
          <button
            type="button"
            onClick={onDeactivate}
            className="w-full py-2.5 bg-error-container/70 hover:bg-error-container text-error rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span className="material-symbols-outlined text-[18px]">archive</span>
            <span>Inactivar Evento</span>
          </button>
        )}
      </div>
    </div>
  );
}
