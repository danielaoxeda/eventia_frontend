import type {
  CatalogEvent,
  Category,
  CategoryRow,
  EventRow,
  PriceRange,
  TicketTypeRow,
} from "../types/event.types";
import api from "@/shared/services/api";
// Respaldo local (db.json): se usa solo si el backend está apagado.
import db from "../../../../db.json";

/** Mes abreviado para la insignia de fecha (ej. "NOV"). */
const MONTH_CODES = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OCT",
  "NOV",
  "DIC",
];

/** Etiqueta corta de tarjeta por categoría. */
const TAG_BY_CATEGORY: Record<string, string> = {
  Conciertos: "Concierto",
  Festivales: "Festival",
  "Teatro & Artes": "Teatro",
  "Gastronomía & Ferias": "Gastronomía",
  "Tecnología & Startups": "Tecnología",
};

/** Forma de db.json usada solo como respaldo si el backend no responde. */
interface DbShape {
  events?: EventRow[];
  ticket_types?: TicketTypeRow[];
  categories?: CategoryRow[];
}

const dbData = db as unknown as DbShape;

/**
 * Mapea una fila de db.json al modelo del catálogo:
 * categoría por join, fecha descompuesta, precio mínimo de sus
 * tipos de entrada y % vendido desde el aforo disponible.
 */
function mapEvent(
  row: EventRow,
  tickets: TicketTypeRow[],
  categories: CategoryRow[],
): CatalogEvent {
  const date = new Date(`${row.date}T00:00:00`);
  const eventId = Number(row.id);
  const categoryName = (categories.find((item) => item.id === row.id_category)
    ?.name ?? "Conciertos") as Category;
  const eventTickets = tickets.filter((ticket) => ticket.id_event === eventId);
  const soldPct =
    row.capacity > 0
      ? Math.round(
          ((row.capacity - row.available_capacity) / row.capacity) * 100,
        )
      : 0;
  return {
    id: eventId,
    title: row.title,
    category: categoryName,
    month: MONTH_CODES[date.getMonth()] ?? "",
    day: String(date.getDate()).padStart(2, "0"),
    dateOrder: date.getTime(),
    venue: row.location,
    city: row.city,
    price:
      eventTickets.length > 0
        ? Math.min(...eventTickets.map((ticket) => ticket.price))
        : 0,
    soldPct,
    image: "",
    tag: TAG_BY_CATEGORY[categoryName] ?? categoryName,
  };
}

/** Eventos de respaldo desde db.json (solo si el backend no responde). */
function fallbackEvents(): CatalogEvent[] {
  return (dbData.events ?? [])
    .filter((row) => row.active)
    .map((row) =>
      mapEvent(row, dbData.ticket_types ?? [], dbData.categories ?? []),
    );
}

// --- Lo que manda el backend (GET /events) ---
interface BackendEvent {
  id: number;
  title: string;
  description: string;
  date: string; // "2026-11-22"
  location: string;
  capacity: number;
  status: string;
  category: string;
  price: number;
  soldPct: number;
}

function mapBackendEvent(row: BackendEvent): CatalogEvent {
  const date = new Date(`${row.date}T00:00:00`);
  const categoryName = (row.category || "Conciertos") as Category;
  return {
    id: row.id,
    title: row.title,
    category: categoryName,
    month: MONTH_CODES[date.getMonth()] ?? "",
    day: String(date.getDate()).padStart(2, "0"),
    dateOrder: date.getTime(),
    venue: row.location,
    // El backend todavía no envía ciudad: usamos la ubicación como respaldo.
    city: row.location,
    price: row.price,
    soldPct: row.soldPct,
    image: "",
    tag: TAG_BY_CATEGORY[categoryName] ?? categoryName,
  };
}

/**
 * Trae los eventos del backend real: GET /events
 * Si el backend está apagado, usa db.json para que la página no se rompa.
 */
export async function getEvents(): Promise<CatalogEvent[]> {
  console.log("[Eventia] 🎫 Pidiendo eventos al backend (GET /events)...");
  try {
    const { data } = await api.get<BackendEvent[]>("/events");
    const events = (data ?? []).map(mapBackendEvent);
    console.log(`[Eventia] ✅ Llegaron ${events.length} eventos desde el backend`);
    return events.length > 0 ? events : fallbackEvents();
  } catch {
    console.warn("[Eventia] ⚠️ Backend no disponible, usando datos de respaldo (db.json)");
    return fallbackEvents();
  }
}

/** Alias conservado de la conexión anterior. */
export const fetchEvents = getEvents;

/** Porcentaje de descuento de la promo (aplica solo a elegibles). */
export const PROMO_DISCOUNT_PCT = 15;

/**
 * Normaliza un nombre para compararlo: minúsculas, sin tildes ni espacios
 * sobrantes ("Gerónimo" y "geronimo" coinciden).
 */
function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Regla de negocio 1: la promo aplica a todo usuario cuyo primer nombre
 * sea Roberto o Gerónimo.
 */
export function isPromoUser(userName: string): boolean {
  const firstName = normalizeName(userName).split(/\s+/)[0] ?? "";
  return firstName === "roberto" || firstName === "geronimo";
}

/** Orden fijo de categorías en los filtros. */
export const CATEGORY_ORDER: Category[] = [
  "Conciertos",
  "Festivales",
  "Teatro & Artes",
  "Tecnología & Startups",
  "Gastronomía & Ferias",
];

/** Rangos de precio del filtro (montos en soles). */
export const PRICE_RANGES: PriceRange[] = [
  { id: "ALL", label: "Todos", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "UNDER_60", label: "Menos de S/ 60", min: 0, max: 60 },
  { id: "BETWEEN_60_120", label: "S/ 60 – S/ 120", min: 60, max: 121 },
  { id: "BETWEEN_120_200", label: "S/ 120 – S/ 200", min: 120, max: 201 },
  {
    id: "OVER_200",
    label: "Más de S/ 200",
    min: 200,
    max: Number.POSITIVE_INFINITY,
  },
];

/** Meses presentes en el catálogo (código → etiqueta). */
export const MONTH_LABELS: Record<string, string> = {
  ENE: "Enero",
  NOV: "Noviembre",
  DIC: "Diciembre",
};

/** Formato moneda peruana (ej. "S/ 120.00"). */
export function formatPrice(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}
