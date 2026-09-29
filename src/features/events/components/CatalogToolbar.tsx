import type { SortKey, ViewMode } from "../types/event.types";

interface CatalogToolbarProps {
  total: number;
  /** Ciudades distintas de los resultados (derivado de los datos). */
  locationLabel: string;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  view: ViewMode;
  onViewChange: (value: ViewMode) => void;
}

/** Barra de resultados: conteo, orden y densidad (cuadrícula/lista). */
export default function CatalogToolbar({
  total,
  locationLabel,
  sort,
  onSortChange,
  view,
  onViewChange,
}: CatalogToolbarProps) {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="font-display font-bold text-lg truncate">
          {total} {total === 1 ? "evento encontrado" : "eventos encontrados"}
        </h2>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline shrink-0"></span>
        <span className="text-xs text-outline whitespace-nowrap hidden sm:inline truncate max-w-[220px]">
          {locationLabel}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <label htmlFor="sort-select" className="text-xs text-outline whitespace-nowrap shrink-0">
            ORDENAR:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="bg-surface-container-low text-sm font-medium px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-w-0 max-w-[160px]"
          >
            <option value="popular">Más populares</option>
            <option value="date">Próxima fecha</option>
            <option value="price-asc">Menor precio (S/)</option>
            <option value="price-desc">Mayor precio (S/)</option>
          </select>
        </div>

        <div className="flex items-center bg-surface-container-low p-1 rounded-lg shrink-0">
          <button
            aria-label="Vista cuadrícula"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            type="button"
            className={`p-1.5 rounded-md ${view === "grid" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
          <button
            aria-label="Vista lista"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            type="button"
            className={`p-1.5 rounded-md ${view === "list" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
          >
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          </button>
        </div>
      </div>
    </div>
  );
}
