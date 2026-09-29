import {
  Activity,
  FolderTree,
  LogOut,
  ShieldCheck,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      path: "/admin/monitoreo",
      label: "Panel de Monitoreo",
      icon: Activity,
    },
    {
      path: "/admin/usuarios",
      label: "Gestión de Usuarios",
      icon: Users,
    },
    {
      path: "/admin/categorias",
      label: "Gestión de Categorías",
      icon: FolderTree,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-surface-container-lowest border-r border-outline-variant/30 select-none">
      {/* Zona superior: Marca y Menú */}
      <div>
        {/* Marca Eventia Backoffice */}
        <div className="flex items-center justify-between px-2 py-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-black text-xl text-primary tracking-tight block leading-none">
                Eventia
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-on-surface-variant uppercase mt-1 block">
                BACKOFFICE
              </span>
            </div>
          </div>

          {/* Botón cerrar para móvil */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
            aria-label="Cerrar barra lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sección de Navegación con 3 Opciones de Administrador */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-outline mb-2 font-display">
            ADMINISTRACIÓN
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left ${
                  isActive
                    ? "bg-primary text-on-primary shadow-xs font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-on-primary" : "text-on-surface-variant"}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zona inferior: Botón Cerrar Sesión y Card Institucional */}
      <div className="pt-4 border-t border-outline-variant/20 space-y-3">
        {/* Botón Cerrar Sesión */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-error-container/30 hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4 text-inherit" />
          <span>Cerrar Sesión</span>
        </button>

        {/* Card institucional Eventia */}
        <div className="bg-surface-container-low/70 rounded-xl p-3 border border-outline-variant/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-on-surface truncate">Eventia S.A.C.</div>
            <div className="text-[11px] text-on-surface-variant truncate">Sede Lima, Perú</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar fijo en Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 z-30">
        {sidebarContent}
      </aside>

      {/* Drawer móvil con overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
