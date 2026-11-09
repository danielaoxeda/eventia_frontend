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

function mapTicket(raw: any): BuyerTicket {
  return {
    id: raw.id,
    eventTitle: raw.eventTitle ?? raw.event_title ?? raw.event?.title ?? "Evento",
    ticketType: raw.ticketType ?? raw.ticket_type ?? raw.ticketTypeName ?? raw.type?.name ?? "Entrada",
    eventDate: raw.eventDate ?? raw.event_date ?? raw.event?.date ?? "",
    venue: raw.venue ?? raw.location ?? raw.event?.location ?? "",
    status: raw.status ?? "VIGENTE",
    code: raw.code ?? raw.qr_code ?? raw.ticketCode ?? undefined,
    orderId: raw.orderId ?? raw.id_order ?? raw.order?.id ?? undefined,
  };
}

export async function getMyTickets(): Promise<BuyerTicket[]> {
  const attempts: Array<() => Promise<any[]>> = [
    () => api.get<any[]>("/api/tickets/my", { skipAuthRedirect: false } as any).then((r) => r.data || []),
    () => api.get<any[]>("/api/me/tickets", { skipAuthRedirect: false } as any).then((r) => r.data || []),
    () => api.get<any[]>("/tickets", { skipAuthRedirect: false } as any).then((r) => r.data || []),
  ];
  for (const attempt of attempts) {
    try {
      const data = await attempt();
      return data.map(mapTicket);
    } catch (err: any) {
      if (err?.response?.status && ![404, 405, 501].includes(err.response.status)) throw err;
    }
  }
  return [];
}
