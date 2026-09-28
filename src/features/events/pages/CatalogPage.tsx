import { useEffect, useState } from "react";
import Footer from "../../../shared/layouts/Footer";
import CatalogFilterBar from "../components/CatalogFilterBar";
import CatalogToolbar from "../components/CatalogToolbar";
import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";
import {
  CATEGORY_ORDER,
  getEvents,
  PRICE_RANGES,
} from "../services/events.service";
import type {
  CatalogEvent,
  Category,
  SortKey,
  ViewMode,
} from "../types/event.types";

/** Cantidad de eventos visibles por página. */
const PAGE_SIZE = 6;

/* Página del catálogo público de eventos */
export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [priceRangeId, setPriceRangeId] = useState("ALL");
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [sort, setSort] = useState<SortKey>("popular");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);

  const [events, setEvents] = useState<CatalogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    getEvents()
      .then((data) => {
        if (active) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Revisa que el servidor esté activo (npm run server).");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [reload]);

  // Opciones derivadas de los datos del servicio (sin valores fijos).
  const months = Array.from(new Set(events.map((event) => event.month)));
  const locations = Array.from(new Set(events.map((event) => event.venue)));
  const categories = CATEGORY_ORDER.filter((name) =>
    events.some((event) => event.category === name),
  );
  const priceRange =
    PRICE_RANGES.find((range) => range.id === priceRangeId) ?? PRICE_RANGES[0];

  // Cada cambio de filtro vuelve a la primera página (evita páginas vacías).
  const resetPage = () => setPage(1);

  const handleSortChange = (value: SortKey) => {
    setSort(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setMonth("ALL");
    setLocation("ALL");
    setPriceRangeId("ALL");
    setCategory("ALL");
    setSort("popular");
    setPage(1);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReload((n) => n + 1);
  };
  const scrollToResults = () => {
    document
      .getElementById("catalog-results")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const query = search.trim().toLowerCase();

  const result = events.filter((event) => {
    if (category !== "ALL" && event.category !== category) return false;
    if (month !== "ALL" && event.month !== month) return false;
    if (location !== "ALL" && event.venue !== location) return false;
    if (event.price < priceRange.min || event.price >= priceRange.max)
      return false;
    if (
      query &&
      !`${event.title} ${event.venue} ${event.city}`
        .toLowerCase()
        .includes(query)
    )
      return false;
    return true;
  });

  const filtered = [...result].sort((a, b) => {
    if (sort === "date") return a.dateOrder - b.dateOrder;
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return b.soldPct - a.soldPct;
  });

  // Paginación defensiva: la página actual nunca sale del rango válido.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  // Ciudades de los resultados (sin texto fijo).
  const locationLabel = Array.from(
    new Set(filtered.map((event) => event.city)),
  ).join(" · ");

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3 px-4 text-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
        <p className="text-sm text-on-surface-variant">Cargando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="material-symbols-outlined text-5xl text-outline">
          cloud_off
        </span>
        <h1 className="font-display font-extrabold text-2xl">
          No se pudieron cargar los eventos
        </h1>
        <p className="text-sm text-on-surface-variant">
          Revisa que el servidor esté activo (<code>npm run server</code>).
        </p>
        <button
          onClick={handleRetry}
          className="mt-2 px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <div className="w-full pt-16 min-h-screen min-w-0">
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 min-w-0 flex flex-col gap-4 sm:gap-6">
          <CatalogFilterBar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              resetPage();
            }}
            month={month}
            onMonthChange={(value) => {
              setMonth(value);
              resetPage();
            }}
            months={months}
            location={location}
            onLocationChange={(value) => {
              setLocation(value);
              resetPage();
            }}
            locations={locations}
            priceRangeId={priceRangeId}
            onPriceRangeChange={(value) => {
              setPriceRangeId(value);
              resetPage();
            }}
            category={category}
            onCategoryChange={(value) => {
              setCategory(value as Category | "ALL");
              resetPage();
            }}
            categories={categories}
            onSubmit={scrollToResults}
          />

          {/* Fila compacta: limpiar filtros. */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={clearFilters}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:opacity-80 transition ml-auto shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">
                restart_alt
              </span>
              Limpiar
            </button>
          </div>

          <div
            id="catalog-results"
            className="flex flex-col gap-4 sm:gap-6 min-w-0 scroll-mt-24"
          >
            <CatalogToolbar
              total={filtered.length}
              locationLabel={locationLabel}
              sort={sort}
              onSortChange={handleSortChange}
              view={view}
              onViewChange={setView}
            />

            {paged.length === 0 ? (
              // Estado vacío con salida clara (limpiar filtros).
              <div className="bg-surface-container-lowest p-10 rounded-xl text-center shadow-sm min-w-0">
                <span className="material-symbols-outlined text-5xl text-outline">
                  search_off
                </span>
                <h3 className="font-display font-bold text-xl mt-2">
                  Sin resultados
                </h3>
                <p className="text-sm text-on-surface-variant mt-1 wrap-break-word">
                  Prueba quitando filtros o pulsa “Limpiar”.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0"
                    : "flex flex-col gap-4 min-w-0"
                }
              >
                {paged.map((event) => (
                  <EventCard key={event.id} event={event} view={view} />
                ))}
              </div>
            )}

            <Pagination
              page={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
