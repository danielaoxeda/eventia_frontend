import { type AxiosRequestConfig } from "axios";
import api from "@/shared/services/api";

export interface BuyerTicket {
  id: string | number;
  eventTitle: string;
  ticketType: string;
  eventDate: string;
  venue: string;
  status: string;
  code?: string;
  orderId?: string | number;
}

interface RawTicket {
  id: string | number;
  eventTitle?: string;
  event_title?: string;
  event?: { title?: string; date?: string; location?: string };
  ticketType?: string;
  ticket_type?: string;
  ticketTypeName?: string;
  type?: { name?: string };
  eventDate?: string;
  event_date?: string;
  eventDateTime?: string;
  venue?: string;
  location?: string;
  status?: string;
  code?: string;
  qr_code?: string;
  ticketCode?: string;
  orderId?: string | number;
  id_order?: string | number;
  order?: { id?: string | number };
}

interface TicketsRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect: boolean;
}

function mapTicket(raw: RawTicket): BuyerTicket {
  return {
    id: raw.id,
    eventTitle: raw.eventTitle ?? raw.event_title ?? raw.event?.title ?? "Evento",
    ticketType: raw.ticketType ?? raw.ticket_type ?? raw.ticketTypeName ?? raw.type?.name ?? "Entrada",
    eventDate: raw.eventDate ?? raw.event_date ?? raw.eventDateTime ?? raw.event?.date ?? "",
    venue: raw.venue ?? raw.location ?? raw.event?.location ?? "",
    status: raw.status ?? "VIGENTE",
    code: raw.code ?? raw.qr_code ?? raw.ticketCode ?? undefined,
    orderId: raw.orderId ?? raw.id_order ?? raw.order?.id ?? undefined,
  };
}

export async function getMyTickets(): Promise<BuyerTicket[]> {
  const authRedirectOpts: TicketsRequestConfig = { skipAuthRedirect: false };
  const { data } = await api.get<RawTicket[]>("/api/tickets/my", authRedirectOpts);
  return (data ?? []).map(mapTicket);
}
