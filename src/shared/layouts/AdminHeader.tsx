interface AdminHeaderProps {
  onNewUser: () => void;
}

export default function AdminHeader({ onNewUser }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow z-40 flex items-center justify-between gap-3 px-4 sm:px-6 min-w-0">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="hidden sm:flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg min-w-0">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">sensors</span>
          <span className="text-xs text-on-surface-variant truncate">
            Turno activo: <strong className="text-on-surface">Arena 1 Costa Verde</strong>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-secondary text-xs whitespace-nowrap">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          <span>Capacidad general al 84%</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={onNewUser}
          className="hidden sm:flex items-center gap-2 bg-primary text-on-primary px-3.5 py-1.5 rounded-lg hover:opacity-90 transition text-xs font-semibold shadow-sm whitespace-nowrap"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Nuevo Usuario</span>
        </button>
        <button
          aria-label="Alertas en tiempo real"
          className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high relative shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"></span>
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xs font-bold shrink-0">
            VM
          </div>
          <div className="hidden lg:flex flex-col min-w-0">
            <span className="text-xs font-semibold leading-tight truncate">Valeria Mendoza</span>
            <span className="text-xs text-outline leading-tight truncate">vmendoza@eventia.pe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
