import { Link, NavLink } from "react-router-dom";

const NAV = [
  { to: "/admin/users", icon: "badge", label: "Directorio & Roles" },
  { to: "/admin/categories", icon: "schema", label: "Categorías" },
  { to: "/", icon: "confirmation_number", label: "Explorar Eventos" },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow z-50 hidden lg:flex flex-col justify-between py-4 px-4">
      <div className="flex flex-col gap-6 min-h-0">
        <Link to="/admin/users" className="flex items-center gap-3 px-2 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center font-display font-extrabold text-xl shrink-0">
            E
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display font-semibold text-lg leading-none truncate">Eventia</span>
            <span className="text-[11px] text-primary font-bold tracking-wide uppercase mt-1">
              Gestión Perú
            </span>
          </div>
        </Link>

        <div className="bg-surface-container px-3 py-2 rounded-lg flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-outline">ROL VIGENTE</span>
            <span className="text-sm font-bold truncate">Organizador / Admin</span>
          </div>
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
            verified_user
          </span>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Administración">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-w-0 ${
                  isActive
                    ? "bg-primary-container/20 text-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <div className="bg-surface-container-high p-3 rounded-lg flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-outline">SISTEMA PUERTA</span>
            <span className="text-xs font-semibold truncate">En línea (sincronizado)</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0"></span>
        </div>
      </div>
    </aside>
  );
}
