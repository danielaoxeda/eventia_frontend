/** Categorías visibles del catálogo (etiquetas en español para la UI). */
export type Category =
  | "Conciertos"
  | "Festivales"
  | "Teatro & Artes"
  | "Tecnología & Startups"
  | "Gastronomía & Ferias";

/** Evento del catálogo (todos son elegibles para la promo futura). */
export interface CatalogEvent {
  id: number;
  title: string;
  category: Category;
  /** Mes abreviado para la insignia de fecha (ej. "NOV"). */
  month: string;
  /** Día para la insignia de fecha (ej. "22"). */
  day: string;
  /** Orden cronológico; se usa para ordenar por próxima fecha. */
  dateOrder: number;
  venue: string;
  city: string;
  /** Precio base en soles, sin descuento. */
  price: number;
  /** Porcentaje vendido (0-100); >= 85 se marca como urgente. */
  soldPct: number;
  image: string;
  tag?: string;
}

/** Criterios de orden del toolbar. */
export type SortKey = "popular" | "date" | "price-asc" | "price-desc";

/** Densidad visual de la grilla de resultados. */
export type ViewMode = "grid" | "list";

export interface EventRow {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  city: string;
  capacity: number;
  available_capacity: number;
  status: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  id_category: string;
  id_organizer: number;
}

/** Fila de `ticket_types`. */
export interface TicketTypeRow {
  id: string;
  id_event: number;
  name: string;
  price: number;
  stock: number;
}

/** Fila de `categories`. */
export interface CategoryRow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Rango de precio del filtro (montos en soles). */
export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}
export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}
