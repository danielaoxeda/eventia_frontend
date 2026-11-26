import type {
  DailySalesDataPoint,
  EventStatus,
  OrganizerDashboardData,
  OrganizerEvent,
  TicketType,
  ZoneDistributionDataPoint,
} from "../types/organizer.types";

export type ApiPage<T> = { content?: T[] } | T[];

/** Evento del organizador con los campos extendidos que devuelve la API de detalle. */
export type OrganizerEventDetail = OrganizerEvent & {
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  categoryId?: number;
};

export interface ApiEventSummary {
  id: number | string;
  title: string;
  description?: string | null;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  capacity?: number | null;
  bannerUrl?: string | null;
  categoryName?: string | null;
  status?: string | null;
  active?: boolean | null;
  ticketsSold?: number | null;
  totalRevenue?: number | null;
  city?: string | null;
}

export interface ApiEventDetail extends ApiEventSummary {
  categoryId?: number | null;
  organizerId?: number | null;
  organizerName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ApiTicketType {
  id: number | string;
  eventId?: number | string | null;
  eventTitle?: string | null;
  name: string;
  zone?: string | null;
  price?: number | null;
  totalCapacity?: number | null;
  availableCapacity?: number | null;
  soldCount?: number | null;
  status?: string | null;
  active?: boolean | null;
  saleStartDate?: string | null;
  saleEndDate?: string | null;
}

export interface ApiOrganizerDashboard {
  kpis: {
    activeEvents?: number | null;
    activeEventsChange?: number | null;
    ticketsSold?: number | null;
    ticketsSoldChange?: number | null;
    totalRevenuePEN?: number | null;
    totalRevenueChange?: number | null;
    occupancyRate?: number | null;
    occupancyRateChange?: number | null;
  };
  dailySales?: DailySalesDataPoint[] | null;
  zoneDistribution?: ZoneDistributionDataPoint[] | null;
  recentEvents?: ApiEventSummary[] | null;
  activeShift?: {
    venue?: string | null;
    gateSystemStatus?: string | null;
    generalCapacityWarning?: string | null;
  } | null;
}

export function unwrapPage<T>(data: ApiPage<T>): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
}

export function mapBackendEventStatus(status?: string | null): EventStatus {
  switch ((status || "").toUpperCase()) {
    case "PUBLISHED":
      return "published";
    case "CANCELLED":
      return "cancelled";
    case "FINISHED":
      return "finished";
    case "PENDING":
    default:
      return "pending";
  }
}

export function toBackendEventStatus(status?: string | null): string {
  switch (status) {
    case "published":
      return "PUBLISHED";
    case "cancelled":
      return "CANCELLED";
    case "finished":
      return "FINISHED";
    case "pending":
    default:
      return "PENDING";
  }
}

export function mapApiEventToOrganizer(event: ApiEventSummary | ApiEventDetail): OrganizerEventDetail {
  const id = String(event.id);
  const ticketsSold = Number(event.ticketsSold ?? 0);
  const capacity = Number(event.capacity ?? 0);
  const status = mapBackendEventStatus(event.status);
  const venue = event.location || "";
  return {
    id,
    code: `EVT-${id}`,
    title: event.title || "",
    category: event.categoryName || "Sin categoría",
    venue,
    city: event.city || "",
    date: event.date || "",
    time: (event.startTime || "").slice(0, 5),
    bannerUrl:
      event.bannerUrl ||
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    status,
    active: event.active !== false,
    capacity,
    ticketsSold,
    totalRevenue: Number(event.totalRevenue ?? 0),
    description: (event as ApiEventDetail).description ?? undefined,
    startTime: (event.startTime || "").slice(0, 5) || undefined,
    endTime: (event.endTime || "").slice(0, 5) || undefined,
    location: event.location || undefined,
    categoryId: (event as ApiEventDetail).categoryId ?? undefined,
  };
}

export function toApiEventRequest(data: {
  title: string;
  category?: string;
  venue?: string;
  city?: string;
  location?: string;
  date?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  bannerUrl?: string;
  status?: string;
  active?: boolean;
  capacity?: number;
  description?: string;
  categoryId?: number | string;
}) {
  const start = (data.startTime || data.time || "09:00").slice(0, 5);
  const [h, m] = start.split(":").map((v) => Number(v || 0));
  const endHour = Math.min(23, h + 2);
  const end = (data.endTime || `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`).slice(0, 5);
  const categoryId = data.categoryId != null && data.categoryId !== "" ? Number(data.categoryId) : 1;
  return {
    title: data.title,
    description: data.description ?? "",
    date: data.date,
    startTime: start.length === 5 ? `${start}:00` : start,
    endTime: end.length === 5 ? `${end}:00` : end,
    location: data.location || data.venue || data.city || "Por definir",
    capacity: Number(data.capacity ?? 0),
    categoryId,
    bannerUrl: data.bannerUrl || null,
    status: toBackendEventStatus(data.status),
  };
}

export function mapApiTicketToOrganizer(ticket: ApiTicketType): TicketType {
  const total = Number(ticket.totalCapacity ?? 0);
  const sold = Number(ticket.soldCount ?? Math.max(0, total - Number(ticket.availableCapacity ?? total)));
  const backendStatus = (ticket.status || "").toUpperCase();
  const status: TicketType["status"] =
    ticket.active === false || backendStatus === "PAUSED" || backendStatus === "INACTIVE"
      ? "paused"
      : "active";
  return {
    id: String(ticket.id),
    eventId: String(ticket.eventId ?? ""),
    name: ticket.name || "",
    zone: ticket.zone || ticket.name || "General",
    pricePEN: Number(ticket.price ?? 0),
    capacity: total,
    soldCount: sold,
    status,
    saleStartDate: ticket.saleStartDate || undefined,
    saleEndDate: ticket.saleEndDate || undefined,
  };
}

export function toApiTicketRequest(ticket: Partial<TicketType> & { name?: string; pricePEN?: number; capacity?: number }) {
  return {
    name: ticket.name,
    zone: ticket.zone,
    price: ticket.pricePEN,
    totalCapacity: ticket.capacity,
    saleStartDate: ticket.saleStartDate || null,
    saleEndDate: ticket.saleEndDate || null,
  };
}

export function mapApiDashboardToOrganizer(data: ApiOrganizerDashboard): OrganizerDashboardData {
  const kpis = data.kpis || {};
  return {
    kpis: {
      activeEvents: Number(kpis.activeEvents ?? 0),
      activeEventsChange: kpis.activeEventsChange ?? null,
      ticketsSold: Number(kpis.ticketsSold ?? 0),
      ticketsSoldChange: kpis.ticketsSoldChange ?? null,
      totalRevenuePEN: Number(kpis.totalRevenuePEN ?? 0),
      totalRevenueChange: kpis.totalRevenueChange ?? null,
      occupancyRate: Number(kpis.occupancyRate ?? 0),
      occupancyRateChange: kpis.occupancyRateChange ?? null,
    },
    dailySales: data.dailySales || [],
    zoneDistribution: (data.zoneDistribution || []) as ZoneDistributionDataPoint[],
    recentEvents: (data.recentEvents || []).map(mapApiEventToOrganizer),
    activeShift: {
      venue: data.activeShift?.venue || "Sin eventos activos",
      gateSystemStatus:
        data.activeShift?.gateSystemStatus === "online" || data.activeShift?.gateSystemStatus === "syncing" || data.activeShift?.gateSystemStatus === "offline"
          ? data.activeShift.gateSystemStatus
          : "online",
      generalCapacityWarning: data.activeShift?.generalCapacityWarning || undefined,
    },
  };
}
