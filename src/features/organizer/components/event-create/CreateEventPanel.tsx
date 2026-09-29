import { Link } from "react-router-dom";

interface CreateEventPanelProps {
  isPublic: boolean;
  creating: boolean;
  onToggleVisibility: () => void;
  onCreate: (asDraft?: boolean) => void;
  onPreview: () => void;
}

export default function CreateEventPanel({
  isPublic,
  creating,
  onToggleVisibility,
  onCreate,
  onPreview,
}: CreateEventPanelProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-l-primary relative overflow-hidden flex flex-col gap-4">
      <h3 className="font-display text-sm font-bold text-on-surface">
        Configuración de Publicación
      </h3>

      {/* Visibility Toggle */}
      <div className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-on-surface">Publicar al guardar</span>
          <span className="text-[0.6875rem] font-semibold text-primary">
            {isPublic ? "Visible en Cartelera General" : "Guardado Privado (Borrador)"}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isPublic}
            onChange={onToggleVisibility}
          />
          <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>
      </div>

      {/* Acciones principales */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          onClick={() => onCreate(false)}
          disabled={creating}
          className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[20px]">
            {creating ? "hourglass_empty" : "check_circle"}
          </span>
          <span>{creating ? "Creando evento..." : "Crear y Publicar"}</span>
        </button>

        <button
          type="button"
          onClick={() => onCreate(true)}
          disabled={creating}
          className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">draft</span>
          <span>Guardar como Borrador</span>
        </button>

        <button
          type="button"
          onClick={onPreview}
          className="w-full py-2.5 border border-outline-variant/30 hover:bg-surface-container-low text-on-surface rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span>Vista Previa del Evento</span>
        </button>

        <Link
          to="/organizador/dashboard"
          className="w-full py-2.5 text-center text-outline hover:text-on-surface text-xs font-medium transition-colors"
        >
          Cancelar y Volver
        </Link>
      </div>
    </div>
  );
}
