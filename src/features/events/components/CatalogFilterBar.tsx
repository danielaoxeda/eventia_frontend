import { MONTH_LABELS, PRICE_RANGES } from "../services/events.service";

interface CatalogFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
  months: string[];
  location: string;
  onLocationChange: (value: string) => void;
  locations: string[];
  priceRangeId: string;
  onPriceRangeChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  onSubmit: () => void;
}

const FIELD_LABEL = "text-xs font-bold text-on-surface whitespace-nowrap";
const FIELD_CONTROL =
  "w-full bg-surface-container-low text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-0";

/**
 * Barra de búsqueda del catálogo: texto, fecha, ubicación, precio y
 * categoría en una sola fila con botón redondo de buscar.
 */
export default function CatalogFilterBar(props: CatalogFilterBarProps) {
  const {
    search,
    onSearchChange,
    month,
    onMonthChange,
    months,
    location,
    onLocationChange,
    locations,
    priceRangeId,
    onPriceRangeChange,
    category,
    onCategoryChange,
    categories,
    onSubmit,
  } = props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Filtros del catálogo"
      className="bg-surface-container-lowest rounded-2xl shadow-md px-4 sm:px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-4 min-w-0"
    >
      <div className="flex-1 min-w-0">
        <span className={FIELD_LABEL}>Busca tu próximo evento</span>
        <div className="relative mt-1 min-w-0">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${FIELD_CONTROL} pl-10`}
            placeholder="Buscar por evento o artista"
            type="text"
            aria-label="Buscar por evento o artista"
          />
        </div>
      </div>

      <div className="hidden lg:block w-px self-stretch bg-outline-variant/60 shrink-0" />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 flex-2 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <label htmlFor="filter-month" className={FIELD_LABEL}>
            Fecha
          </label>
          <select
            id="filter-month"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className={`${FIELD_CONTROL} cursor-pointer`}
          >
            <option value="ALL">Todas</option>
            {months.map((item) => (
              <option key={item} value={item}>
                {MONTH_LABELS[item] ?? item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <label htmlFor="filter-location" className={FIELD_LABEL}>
            Ubicación
          </label>
          <select
            id="filter-location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className={`${FIELD_CONTROL} cursor-pointer truncate`}
          >
            <option value="ALL">Cualquiera</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <label htmlFor="filter-price" className={FIELD_LABEL}>
            Precio
          </label>
          <select
            id="filter-price"
            value={priceRangeId}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className={`${FIELD_CONTROL} cursor-pointer`}
          >
            {PRICE_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <label htmlFor="filter-category" className={FIELD_LABEL}>
            Categorías
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`${FIELD_CONTROL} cursor-pointer truncate`}
          >
            <option value="ALL">Todas</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        aria-label="Buscar eventos"
        className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-colors shrink-0 self-end lg:self-center"
      >
        <span className="material-symbols-outlined text-[24px]">search</span>
      </button>
    </form>
  );
}
