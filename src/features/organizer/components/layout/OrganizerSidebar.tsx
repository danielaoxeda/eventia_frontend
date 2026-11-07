import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function OrganizerSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      to: "/organizador/dashboard",
      icon: "monitoring",
      label: "Dashboard & Métricas",
    },
    {
      to: "/organizador/eventos/nuevo",
      icon: "add_circle",
      label: "Crear Nuevo Evento",
    },
    {
      to: "/organizador/eventos/EVT-2025-LIM-9812/editar",
      icon: "calendar_month",
      label: "Gestión de Eventos",
    },
    {
      to: "/organizador/eventos/EVT-2025-LIM-9812/entradas",
      icon: "confirmation_number",
      label: "Tarifas y Entradas",
    },
  ];

  const accessControlLinks = [
    {
      to: "/organizador/validar-qr",
      icon: "qr_code_scanner",
      label: "Validar QR",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between p-4 transition-all duration-300 border-r border-outline-variant/20 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      <div className="flex flex-col gap-5">
        {/* Brand Header */}
        <Link
          to="/"
          title="Ir al catálogo"
          className="flex items-center gap-3 px-1 py-1"
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-display font-extrabold text-lg shadow-sm flex-shrink-0">
            E
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-on-surface leading-tight">
                Eventia
              </span>
              <span className="text-[0.6875rem] font-bold text-primary tracking-wider uppercase leading-none mt-0.5">
                Backoffice Perú
              </span>
            </div>
          )}
        </Link>

        {/* Current Role Badge */}
        {!collapsed && (
          <div className="bg-surface-container px-3 py-2.5 rounded-lg flex items-center justify-between border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="text-[0.6875rem] font-bold text-outline uppercase tracking-wider">
                ROL
              </span>
              <span className="text-xs font-bold text-on-surface">
                Organizador
              </span>
            </div>
            <span className="material-symbols-outlined text-primary text-[20px]">
              verified_user
            </span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {!collapsed && (
            <span className="text-[0.6875rem] font-bold text-outline px-3 uppercase tracking-wider mb-1">
              Módulo Organizador
            </span>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs ${isActive
                  ? "bg-primary-container text-on-primary-container font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <span className="material-symbols-outlined text-[20px] flex-shrink-0">
                {item.icon}
              </span>
              {!collapsed && (
                <div className="flex flex-col flex-1 leading-tight">
                  <span>{item.label}</span>
                </div>
              )}
            </NavLink>
          ))}

          {!collapsed && (
            <span className="text-[0.6875rem] font-bold text-outline px-3 uppercase tracking-wider mt-4 mb-1">
              Control de Accesos
            </span>
          )}
          {accessControlLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold shadow-xs"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <span className="material-symbols-outlined text-[20px] flex-shrink-0">
                {item.icon}
              </span>
              {!collapsed && (
                <div className="flex flex-col flex-1 leading-tight">
                  <span>{item.label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom info & Collapse Toggle */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-surface-container">

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-xs font-medium"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {collapsed ? "menu" : "menu_open"}
            </span>
            {!collapsed && <span>Contraer Menú</span>}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-mono bg-surface-container px-1.5 py-0.5 rounded text-outline">
              Ctrl+[
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
