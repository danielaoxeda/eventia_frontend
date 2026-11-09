import type {
  CatalogEvent,
  Category,
  PriceRange
} from "../types/event.types";
import api from "@/shared/services/api";
// Respaldo local (db.json): se usa solo si el backend no responde.

const MONTH_CODES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];

const TAG_BY_CATEGORY: Record<string, string> = {
  Conciertos: "Concierto",
  Festivales: "Festival",
  "Teatro & Artes": "Teatro",
  "Gastronomía & Ferias": "Gastronomía",
  "Tecnología & Startups": "Tecnología",
};


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
    // Pedimos hasta 100 eventos (o el número que consideres) para el filtrado en cliente
    const { data } = await api.get<{ content: BackendEvent[] }>("/api/events", { 
      params: { size: 100 },
      skipAuthRedirect: true 
    } as any);
    
    // Extraemos la propiedad 'content' donde está realmente el arreglo
    const eventsArray = data?.content ?? [];
    
    return eventsArray.map(mapBackendEvent);
  } catch (error) {
    console.error("[Eventia] Error al conectar con el backend real:", error);
    throw error;
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
