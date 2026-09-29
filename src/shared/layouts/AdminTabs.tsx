import { NavLink } from "react-router-dom";

export default function AdminTabs() {
  const base =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap shrink-0";
  return (
    <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl mt-2 w-fit max-w-full overflow-x-auto shadow-inner">
      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `${base} ${isActive ? "bg-white text-primary shadow-sm font-bold" : "text-on-surface-variant font-semibold hover:text-on-surface"}`
        }
      >
        <span className="material-symbols-outlined text-[20px]">badge</span>
        <span>Directorio de Usuarios y Roles</span>
        <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">
          2,842
        </span>
      </NavLink>
      <NavLink
        to="/admin/categories"
        className={({ isActive }) =>
          `${base} ${isActive ? "bg-white text-primary shadow-sm font-bold" : "text-on-surface-variant font-semibold hover:text-on-surface"}`
        }
      >
        <span className="material-symbols-outlined text-[20px]">schema</span>
        <span>Categorías de Eventos</span>
        <span className="bg-surface-container-high text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">
          6
        </span>
      </NavLink>
    </div>
  );
}
