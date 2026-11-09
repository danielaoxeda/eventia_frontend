import axios from "axios";
import api from "@/shared/services/api";
import type { EventDetailData, TicketTier } from "../types/event-detail.types";

const MONTH_CODES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DIC"];
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
const TIER_DOTS = ["bg-primary-container", "bg-tertiary", "bg-primary"];

interface ApiEventDetail {
  id: number | string;
  title: string;
  description?: string | null;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  location: string;
  city?: string | null;
  capacity?: number | null;
  bannerUrl?: string | null;
  status?: string | null;
  active?: boolean | null;
  categoryName?: string | null;
}

interface ApiTicketType {
  id: number | string;
  name: string;
  zone?: string | null;
  price?: number | null;
  totalCapacity?: number | null;
  availableCapacity?: number | null;
  soldCount?: number | null;
  status?: string | null;
  active?: boolean | null;
}

function mapTier(ticket: ApiTicketType, index: number): TicketTier | null {
  if (ticket.active === false) return null;
  const total = Number(ticket.totalCapacity ?? 0);
  const available = Number(ticket.availableCapacity ?? Math.max(0, total - Number(ticket.soldCount ?? 0)));
  const price = Number(ticket.price ?? 0);
  return {
    id: Number(ticket.id),
    name: ticket.zone ? `${ticket.name} · ${ticket.zone}` : ticket.name,
    description: `${available} entradas disponibles`,
    note: available < 100 ? `¡Últimas ${available}!` : "Disponibilidad regular",
    price,
    regularPrice: Math.max(price, Math.round(price / 0.85)),
    dot: TIER_DOTS[index % TIER_DOTS.length],
  };
}

export async function getEventDetail(eventId: string): Promise<EventDetailData | null> {
  try {
    const publicOpts = { skipAuthRedirect: true } as any;
    const [eventRes, ticketsRes] = await Promise.all([
      api.get<ApiEventDetail>(`/api/events/${eventId}`, publicOpts),
      api.get<ApiTicketType[]>(`/api/events/${eventId}/ticket-types`, publicOpts),
    ]);

    const row = eventRes.data;
    if (!row || row.active === false) return null;
    const status = (row.status || "").toUpperCase();
    if (status && !["PUBLISHED", "PUBLICADO", "ACTIVE"].includes(status)) return null;

    const date = new Date(`${row.date}T00:00:00`);
    const day = String(date.getDate()).padStart(2, "0");
    const startTime = (row.startTime || "00:00:00").slice(0, 5);

    return {
      id: Number(row.id),
      title: row.title,
      venue: row.location,
      city: row.city || row.location || "",
      dateLabel: `${day} ${MONTH_NAMES[date.getMonth()] ?? ""} ${date.getFullYear()}`,
      month: MONTH_CODES[date.getMonth()] ?? "",
      day,
      eventDate: `${row.date}T${startTime}:00`,
      tiers: (ticketsRes.data || []).map(mapTier).filter((t): t is TicketTier => !!t),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && [401, 403, 404].includes(error.response?.status ?? 0)) return null;
    throw error;
  }
}

export const MAX_TICKETS = 10;

export function formatPEN(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}
