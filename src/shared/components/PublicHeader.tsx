import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import eventiaLogo from "../../assets/Logo-Eventia.jpg";

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">

        {/* Logo / Home */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={eventiaLogo}
            alt="Eventia"
            className="w-12 h-12 object-contain"
          />

          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight leading-none text-indigo-600">
              Eventia
            </span>
          </div>
        </Link>

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

          <NavLink
            to="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Iniciar Sesión
          </NavLink>

          <NavLink
            to="/registro"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Registrarse
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="public-mobile-menu"
        >
          <span className="material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav
          id="public-mobile-menu"
          className="flex flex-col gap-2 border-t border-slate-100 bg-white px-6 py-4 md:hidden"
        >
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            Explorar Eventos
          </NavLink>

          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Iniciar Sesión
          </NavLink>

          <NavLink
            to="/registro"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Registrarse
          </NavLink>
        </nav>
      )}
    </header>
  );
}