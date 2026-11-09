import type {
  CatalogEvent,
  Category,
  CategoryRow,
  EventRow,
  PriceRange,
  TicketTypeRow,
} from "../types/event.types";
import api from "@/shared/services/api";
// Respaldo local (db.json): se usa solo si el backend no responde.
import db from "../../../../db.json";

const MONTH_CODES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];

const TAG_BY_CATEGORY: Record<string, string> = {
  Conciertos: "Concierto",
  Festivales: "Festival",
  "Teatro & Artes": "Teatro",
  "Gastronomía & Ferias": "Gastronomía",
  "Tecnología & Startups": "Tecnología",
};

interface DbShape {
  events?: EventRow[];
  ticket_types?: TicketTypeRow[];
  categories?: CategoryRow[];
}

const dbData = db as unknown as DbShape;

function mapEvent(row: EventRow, tickets: TicketTypeRow[], categories: CategoryRow[]): CatalogEvent {
  const date = new Date(`${row.date}T00:00:00`);
  const eventId = Number(row.id);
  const categoryName = (categories.find((item) => item.id === row.id_category)?.name ?? "Conciertos") as Category;
  const eventTickets = tickets.filter((ticket) => ticket.id_event === eventId);
  const soldPct = row.capacity > 0 ? Math.round(((row.capacity - row.available_capacity) / row.capacity) * 100) : 0;
  return {
    id: eventId,
    title: row.title,
    category: categoryName,
    month: MONTH_CODES[date.getMonth()] ?? "",
    day: String(date.getDate()).padStart(2, "0"),
    dateOrder: date.getTime(),
    venue: row.location,
    city: row.city,
    price: eventTickets.length > 0 ? Math.min(...eventTickets.map((ticket) => ticket.price)) : 0,
    soldPct,
    image: "",
    tag: TAG_BY_CATEGORY[categoryName] ?? categoryName,
  };
}

function fallbackEvents(): CatalogEvent[] {
  return (dbData.events ?? [])
    .filter((row) => row.active)
    .map((row) => mapEvent(row, dbData.ticket_types ?? [], dbData.categories ?? []));
}

interface BackendEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  status: string;
  category: string;
  categoryName?: string;
  price: number;
  soldPct: number;
  city?: string;
  bannerUrl?: string;
}

function mapBackendEvent(row: BackendEvent): CatalogEvent {
  const date = new Date(`${row.date}T00:00:00`);
  const categoryName = (row.category || row.categoryName || "Conciertos") as Category;
  return {
    id: Number(row.id),
    title: row.title,
    category: categoryName,
    month: MONTH_CODES[date.getMonth()] ?? "",
    day: String(date.getDate()).padStart(2, "0"),
    dateOrder: date.getTime(),
    venue: row.location,
    city: row.city || row.location,
    price: Number(row.price ?? 0),
    soldPct: Number(row.soldPct ?? 0),
    image: row.bannerUrl || "",
    tag: TAG_BY_CATEGORY[categoryName] ?? categoryName,
  };
}

export async function getEvents(): Promise<CatalogEvent[]> {
  try {
    const { data } = await api.get<BackendEvent[]>("/events", { skipAuthRedirect: true } as any);
    return (data ?? []).map(mapBackendEvent);
  } catch {
    console.warn("[Eventia] Backend no disponible, usando datos de respaldo (db.json)");
    return fallbackEvents();
  }
}

export const fetchEvents = getEvents;
export const PROMO_DISCOUNT_PCT = 15;

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isPromoUser(userName: string): boolean {
  const firstName = normalizeName(userName).split(/\s+/)[0] ?? "";
  return firstName === "roberto" || firstName === "geronimo";
}

export const CATEGORY_ORDER: Category[] = [
  "Conciertos",
  "Festivales",
  "Teatro & Artes",
  "Tecnología & Startups",
  "Gastronomía & Ferias",
];

export const PRICE_RANGES: PriceRange[] = [
  { id: "ALL", label: "Todos", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "UNDER_60", label: "Menos de S/ 60", min: 0, max: 60 },
  { id: "BETWEEN_60_120", label: "S/ 60 – S/ 120", min: 60, max: 121 },
  { id: "BETWEEN_120_200", label: "S/ 120 – S/ 200", min: 120, max: 201 },
  { id: "OVER_200", label: "Más de S/ 200", min: 200, max: Number.POSITIVE_INFINITY },
];

export const MONTH_LABELS: Record<string, string> = {
  ENE: "Enero",
  FEB: "Febrero",
  MAR: "Marzo",
  ABR: "Abril",
  MAY: "Mayo",
  JUN: "Junio",
  JUL: "Julio",
  AGO: "Agosto",
  SET: "Setiembre",
  OCT: "Octubre",
  NOV: "Noviembre",
  DIC: "Diciembre",
};

export function formatPrice(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}
