import {
  Bell,
  ChevronDown,
  MapPin,
  Search,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Explorar Eventos",
    path: "/",
  },
  {
    label: "Crear Evento / Organizadores",
    path: "/organizer",
  },
  {
    label: "Mis Entradas",
    path: "/tickets",
  },
  {
    label: "Servicio Premium B2B",
    path: "/premium",
  },
];

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            E
          </div>

          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Eventia
          </span>
        </Link>

        {/* Ubicación */}
        <div className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 xl:flex">
          <MapPin className="h-4 w-4 text-indigo-600" />

          <select
            defaultValue="lima"
            className="cursor-pointer bg-transparent text-sm font-semibold text-slate-700 outline-none"
          >
            <option value="lima">Lima, PE</option>
            <option value="arequipa">Arequipa</option>
            <option value="cusco">Cusco</option>
            <option value="trujillo">Trujillo</option>
          </select>
        </div>

        {/* Buscador */}
        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm lg:flex lg:max-w-md">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />

          <input
            type="text"
            placeholder="Buscar por evento, artista o recinto..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />

          <div className="h-5 w-px bg-slate-200" />

          <select className="cursor-pointer bg-transparent text-xs font-semibold text-slate-600 outline-none">
            <option value="all">Categorías</option>
            <option value="conciertos">Conciertos</option>
            <option value="festivales">Festivales</option>
            <option value="teatro">Teatro</option>
            <option value="conferencias">Conferencias</option>
          </select>
        </div>

        {/* Navegación */}
        <nav className="hidden items-center gap-1 2xl:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-50 font-bold text-indigo-600"
                    : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Acciones */}
        <div className="ml-auto flex shrink-0 items-center gap-2">

          {/* Moneda */}
          <div className="hidden items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 sm:flex">
            <span>PEN</span>
            <span className="text-indigo-600">S/</span>
          </div>

          {/* Notificaciones */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          {/* Publicar evento */}
          <Link
            to="/organizer"
            className="hidden rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 sm:inline-flex"
          >
            Publicar Evento
          </Link>

          {/* Perfil */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700"
            aria-label="Perfil"
          >
            D
          </button>
        </div>
      </div>
    </header>
  );
}