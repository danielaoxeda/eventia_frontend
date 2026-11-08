import { Search, X } from "lucide-react";

export type StatusFilter = "Activo" | "Inactivo" | "Todos";

interface UsersFiltersProps {
  statusFilter: StatusFilter;
  search: string;
  onStatusFilter: (status: StatusFilter) => void;
  onSearch: (value: string) => void;
}

export default function UsersFilters({
  statusFilter,
  search,
  onStatusFilter,
  onSearch,
}: UsersFiltersProps) {
  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: "Todos", label: "Todos" },
    { key: "Activo", label: "Activos" },
    { key: "Inactivo", label: "Inactivos" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
      {/* Filtro por Estado */}
      <div className="flex items-center gap-1 bg-surface-container-low rounded-xl p-1 border border-outline-variant/20">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === tab.key
                ? "bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/30"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nombre, DNI o correo..."
          className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface placeholder-on-surface-variant/60 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
