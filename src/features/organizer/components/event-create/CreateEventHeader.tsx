import { Link } from "react-router-dom";

interface CreateEventHeaderProps {
  isPublic: boolean;
  creating: boolean;
  onCreate: (asDraft?: boolean) => void;
}

export default function CreateEventHeader({
  isPublic,
  creating,
  onCreate,
}: CreateEventHeaderProps) {
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
              Eventos
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span className="text-[0.6875rem] font-semibold text-primary">
              Nuevo Registro
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <h1 className="font-display text-xl font-semibold text-on-surface leading-tight">
              Crear Nuevo Evento
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold bg-primary-container text-on-primary-container">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {isPublic ? "Publicación Inmediata" : "Modo Borrador"}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas Superiores */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCreate(true)}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">draft</span>
          <span>Guardar Borrador</span>
        </button>
        <button
          type="button"
          onClick={() => onCreate(false)}
          disabled={creating}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-all shadow-sm disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">
            {creating ? "hourglass_empty" : "publish"}
          </span>
          <span>{creating ? "Creando..." : "Crear y Publicar"}</span>
        </button>
      </div>
    </div>
  );
}
