import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">

        {/* Logo / Home */}
        <Link
          to="/"
          className="text-xl font-extrabold text-indigo-600"
        >
          Eventia
        </Link>

        {/* Botones de la derecha */}
        <nav className="ml-auto flex items-center gap-3">
          <NavLink
                      to="/login"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Iniciar Sesión
          </NavLink>

          <NavLink
            to="/register"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Registrarse
          </NavLink>

    </nav>

      </div>
    </header>
  );
}