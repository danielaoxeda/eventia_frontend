import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import eventiaLogo from "../../assets/Logo-Eventia.jpg";

export default function UserHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="h-16 max-w-[1280px] mx-auto px-6 flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={eventiaLogo}
            alt="Eventia"
            className="w-12 h-12 object-contain"
          />

          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight leading-none text-slate-900">
              Eventia
            </span>
          </div>
        </Link>

        {/* Navegación */}
        <nav className="ml-auto hidden md:flex items-center gap-3">
           <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-bold"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Explorar Eventos
            </NavLink>
        </nav>

        {/* Cuenta */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="flex items-center gap-2 hover:opacity-80 transition"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              {user
                ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                : "MC"}
            </span>

            <span
              className={`material-symbols-outlined text-slate-400 text-[18px] transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {/* Menú desplegable */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
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
                Mis entradas
              </Link>

              {user?.rol === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-500">
                    admin_panel_settings
                  </span>
                  Panel Administrador
                </Link>
              )}

              {user?.rol === "ORGANIZER" && (
                <Link
                  to="/organizador"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <span className="material-symbols-outlined text-[20px] text-slate-500">
                    dashboard
                  </span>
                  Panel Organizador
                </Link>
              )}

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}