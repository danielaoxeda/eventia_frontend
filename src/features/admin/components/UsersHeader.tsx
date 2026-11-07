import { UserPlus } from "lucide-react";

interface UsersHeaderProps {
  onNuevoOrganizador: () => void;
}

/**
 * Cabecera principal de la vista de usuarios.
 * Muestra el título descriptivo y el botón para registrar un nuevo Organizador.
 */
export default function UsersHeader({ onNuevoOrganizador }: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
      <div>
        <h1 className="font-display font-black text-2xl lg:text-3xl text-on-surface tracking-tight">
          Gestión de Usuarios y Accesos
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
          Supervisión de cuentas registradas y alta de nuevos accesos para{" "}
          <span className="text-primary font-semibold">Organizadores</span> de eventos.
        </p>
      </div>

      <button
        type="button"
        onClick={onNuevoOrganizador}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity shrink-0 self-start shadow-xs"
        title="Registrar nuevo organizador"
      >
        <UserPlus className="w-4 h-4" />
        <span>Nuevo Organizador</span>
      </button>
    </div>
  );
}
