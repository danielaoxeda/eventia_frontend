import type { CatalogEvent, Category } from "../types/event.types";
// Respaldo local (db.json): se usa solo si el backend está apagado.
import db from "../../../../db.json";
import api from "../../../shared/services/api";

/** Fila de `categories` en db.json (ver diagrama ER). */
interface DbCategory {
  id_category: string;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/** Fila de `events` en db.json (ver diagrama ER). */
interface DbEvent {
  id_event: number;
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

/** Fila de `ticket_types` en db.json (ver diagrama ER). */
interface DbTicketType {
  id: number;
  id_event: number;
  name: string;
  price: number;
  stock: number;
}

interface DbShape {
  categories?: DbCategory[];
  events?: DbEvent[];
  ticket_types?: DbTicketType[];
}

const dbData = db as DbShape;
const DB_CATEGORIES = dbData.categories ?? [];
const DB_EVENTS = dbData.events ?? [];
const DB_TICKET_TYPES = dbData.ticket_types ?? [];

/** Mes abreviado para la insignia de fecha (ej. "NOV"). */
const MONTH_CODES = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SET", "OCT", "NOV", "DIC",
];

/** Etiqueta corta de tarjeta por categoría. */
const TAG_BY_CATEGORY: Record<string, string> = {
  Conciertos: "Concierto",
  Festivales: "Festival",
  "Teatro & Artes": "Teatro",
  "Gastronomía & Ferias": "Gastronomía",
  "Tecnología & Startups": "Tecnología",
};

/** Insignia según aforo vendido (derivado, sin texto fijo por evento). */
function badgeFor(soldPct: number): string | undefined {
  if (soldPct >= 90) return "¡Casi Agotado!";
  if (soldPct >= 80) return "Últimas entradas";
  return undefined;
}

/**
 * Mapea una fila de db.json al modelo del catálogo:
 * categoría por join, fecha descompuesta, precio mínimo de sus
 * tipos de entrada y % vendido desde el aforo disponible.
 */
function mapEvent(row: DbEvent): CatalogEvent {
  const date = new Date(`${row.date}T00:00:00`);
  const tickets = DB_TICKET_TYPES.filter((ticket) => ticket.id_event === row.id_event);
  const categoryName = (DB_CATEGORIES.find((item) => item.id_category === row.id_category)?.name ??
    "Conciertos") as Category;
  const soldPct =
    row.capacity > 0
      ? Math.round(((row.capacity - row.available_capacity) / row.capacity) * 100)
      : 0;
  return {
    id: row.id_event,
    title: row.title,
    category: categoryName,
    month: MONTH_CODES[date.getMonth()] ?? "",
    day: String(date.getDate()).padStart(2, "0"),
    dateOrder: date.getTime(),
    venue: row.location,
    city: row.city,
    price: tickets.length > 0 ? Math.min(...tickets.map((ticket) => ticket.price)) : 0,
    soldPct,
    image: "",
    tag: TAG_BY_CATEGORY[categoryName] ?? categoryName,
    badge: badgeFor(soldPct),
  };
}

/** Eventos de respaldo desde db.json (solo si el backend no responde). */
export const EVENTS: CatalogEvent[] = DB_EVENTS.filter((row) => row.active).map(mapEvent);

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
    city: row.location,
    price: row.price,
    soldPct: row.soldPct,
    image: "",
    tag: TAG_BY_CATEGORY[categoryName] ?? categoryName,
    badge: badgeFor(row.soldPct),
  };
}

/**
 * Trae los eventos del backend real: GET /events
 * Si el backend está apagado, usa db.json para que la página no se rompa.
 */
export async function fetchEvents(): Promise<CatalogEvent[]> {
  console.log("[Eventia] 🎫 Pidiendo eventos al backend (GET /events)...");
  try {
    const { data } = await api.get<BackendEvent[]>("/events");
    const events = (data ?? []).map(mapBackendEvent);
    console.log(`[Eventia] ✅ Llegaron ${events.length} eventos desde el backend`);
    return events.length > 0 ? events : EVENTS;
  } catch {
    console.warn("[Eventia] ⚠️ Backend no disponible, usando datos de respaldo (db.json)");
    return EVENTS;
  }
}

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

/** Precio final con la promo aplicada. */
export function getPromoPrice(price: number): number {
  return price * (1 - PROMO_DISCOUNT_PCT / 100);
}

/** Orden fijo de categorías en los filtros. */
export const CATEGORY_ORDER: Category[] = [
  "Conciertos",
  "Festivales",
  "Teatro & Artes",
  "Tecnología & Startups",
  "Gastronomía & Ferias",
];

/** Rango de precio del filtro (montos en soles). */
export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

/** Rangos de precio del filtro (montos en soles). */
export const PRICE_RANGES: PriceRange[] = [
  { id: "ALL", label: "Todos", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "UNDER_60", label: "Menos de S/ 60", min: 0, max: 60 },
  { id: "BETWEEN_60_120", label: "S/ 60 – S/ 120", min: 60, max: 121 },
  { id: "BETWEEN_120_200", label: "S/ 120 – S/ 200", min: 120, max: 201 },
  { id: "OVER_200", label: "Más de S/ 200", min: 200, max: Number.POSITIVE_INFINITY },
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
