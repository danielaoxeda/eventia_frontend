import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Clock, LogOut, Menu, Shield, Store, Ticket, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getLimaCurrentTime } from "../utils/adminFormatters";

interface AdminTopbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function AdminTopbar({ onToggleMobileSidebar }: AdminTopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(getLimaCurrentTime());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getLimaCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 sm:px-8 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20 sticky top-0 z-20">
      {/* Lado izquierdo: Botón móvil y Badge de Rol */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-fixed/40 border border-primary-fixed/50 text-xs font-bold text-primary font-display">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>Rol: {user?.rol === "ADMIN" ? "Administrador" : (user?.rol ?? "")}</span>
        </div>
      </div>

      {/* Lado derecho: Reloj en vivo y Perfil del Administrador */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Reloj dinámico con zona horaria de Lima */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/20">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono">{time}</span>
        </div>

        {/* Perfil del usuario autenticado con menú desplegable */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="flex items-center gap-3 cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs sm:text-sm font-bold text-on-surface leading-tight font-display">
                {user ? `${user.firstName} ${user.lastName}` : "Administrador"}
              </div>
              <div className="text-[11px] text-on-surface-variant font-medium">
                {user?.email ?? ""}
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
              <User className="w-5 h-5" />
            </div>

            <ChevronDown
              className={`w-4 h-4 text-on-surface-variant transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Store className="w-4 h-4 text-slate-500" />
                Ver Catálogo
              </Link>

              <Link
                to="/perfil"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <User className="w-4 h-4 text-slate-500" />
                Mi Perfil
              </Link>

              <Link
                to="/mis-tickets"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Ticket className="w-4 h-4 text-slate-500" />
                Mis Entradas
              </Link>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
