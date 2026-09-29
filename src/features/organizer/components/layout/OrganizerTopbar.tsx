import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OrganizerTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : "?";

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-end px-6 lg:px-8 border-b border-outline-variant/20 transition-all">
      <div className="flex items-center gap-3.5">
        {/* Perfil con menú desplegable */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <span className="w-8 h-8 rounded-full bg-indigo-600 ring-1 ring-outline-variant/30 text-xs font-semibold text-white flex items-center justify-center">
              {initials}
            </span>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-on-surface leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : "—"}
              </span>
              <span className="text-[11px] text-outline leading-tight">
                {user?.email ?? ""}
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-outline text-[18px] transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-500">
                  storefront
                </span>
                Ver Catálogo
              </Link>

              <Link
                to="/perfil"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-500">
                  person
                </span>
                Mi Perfil
              </Link>

              <Link
                to="/mis-tickets"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <span className="material-symbols-outlined text-[20px] text-slate-500">
                  confirmation_number
                </span>
                Mis Entradas
              </Link>
            </div>
          )}
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          type="button"
          onClick={handleLogout}
          title="Cerrar sesión"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/60 transition-colors cursor-pointer ml-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
