import type {
  EventRow,
  TicketTypeRow,
} from "@/features/events/types/event.types";
import type { EventDetailData, TicketTier } from "../types/event-detail.types";
import axios from "axios";
import api from "@/shared/services/api";

/** Mes abreviado para insignias y etiquetas (ej. "NOV"). */
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

/** Mes completo en español para etiquetas (ej. "Noviembre"). */
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Setiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/** Colores cíclicos para las localidades del checkout. */
const TIER_DOTS = ["bg-primary-container", "bg-tertiary", "bg-primary"];

function mapTier(ticket: TicketTypeRow, index: number): TicketTier {
  return {
    id: Number(ticket.id),
    name: ticket.name,
    description: `${ticket.stock} entradas disponibles`,
    note:
      ticket.stock < 100
        ? `¡Últimas ${ticket.stock}!`
        : "Disponibilidad regular",
    price: ticket.price,
    regularPrice: Math.round(ticket.price / 0.85),
    dot: TIER_DOTS[index % TIER_DOTS.length],
  };
}

/**
 * Arma la ficha del evento desde db.json: evento por id (o el primero
 * activo) con sus tipos de entrada como localidades comprables.
 */
export async function getEventDetail(
  eventId: string,
): Promise<EventDetailData | null> {
  try {
    const [event, tickets] = await Promise.all([
      api.get<EventRow>(`/events/${eventId}`),
      api.get<TicketTypeRow[]>("/ticket_types", {
        params: { id_event: eventId },
      }),
    ]);
    const row = event.data;
    if (!row.active) return null;

    const date = new Date(`${row.date}T00:00:00`);
    const day = String(date.getDate()).padStart(2, "0");
    return {
      id: Number(row.id),
      title: row.title,
      venue: row.location,
      city: row.city,
      dateLabel: `${day} ${MONTH_NAMES[date.getMonth()] ?? ""} ${date.getFullYear()}`,
      month: MONTH_CODES[date.getMonth()] ?? "",
      day,
      tiers: tickets.data.map(mapTier),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404)
      return null;
    throw error;
  }
}

/** Tope antirreventa por orden de compra. */
export const MAX_TICKETS = 10;

/** Formato moneda peruana (ej. "S/ 320.00"). */
export function formatPEN(value: number): string {
  return `S/ ${value.toFixed(2)}`;
}
