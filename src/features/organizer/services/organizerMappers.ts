import type {
  DailySalesDataPoint,
  EventStatus,
  OrganizerDashboardData,
  OrganizerEvent,
  TicketType,
  ZoneDistributionDataPoint,
} from "../types/organizer.types";

type ApiPage<T> = { content: T[] } | T[];

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
  maxPerPurchase?: number | null;
  isPresale?: boolean | null;
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

export function mapBackendEventStatus(status?: string | null, active = true): EventStatus {
  if (!active) return "inactive";
  switch ((status || "").toUpperCase()) {
    case "PUBLISHED":
      return "published";
    case "HIDDEN":
      return "hidden";
    case "DRAFT":
      return "draft";
    case "CANCELLED":
    case "FINISHED":
      return "inactive";
    case "PENDING":
    default:
      return "draft";
  }
}

export function toBackendEventStatus(status?: string | null): string {
  switch (status) {
    case "published":
    case "almost_sold_out":
    case "sold_out":
      return "PUBLISHED";
    case "hidden":
      return "HIDDEN";
    case "inactive":
      return "CANCELLED";
    case "draft":
    default:
      return "DRAFT";
  }
}

export function mapApiEventToOrganizer(event: ApiEventSummary | ApiEventDetail): OrganizerEvent {
  const id = String(event.id);
  const ticketsSold = Number(event.ticketsSold ?? 0);
  const capacity = Number(event.capacity ?? 0);
  const occupancy = capacity > 0 ? ticketsSold / capacity : 0;
  let status = mapBackendEventStatus(event.status, event.active !== false);
  if (event.active !== false && status === "published") {
    if (occupancy >= 1) status = "sold_out";
    else if (occupancy >= 0.9) status = "almost_sold_out";
  }
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
  let status: TicketType["status"] = "active";
  if (ticket.active === false || backendStatus === "PAUSED" || backendStatus === "INACTIVE") status = "paused";
  if (backendStatus === "SOLD_OUT" || (total > 0 && sold >= total)) status = "sold_out";
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
    isPresale: !!ticket.isPresale,
    maxPerPurchase: ticket.maxPerPurchase ?? undefined,
  };
}

export function toApiTicketRequest(ticket: Partial<TicketType> & { name?: string; pricePEN?: number; capacity?: number }) {
  return {
    name: ticket.name,
    zone: ticket.zone,
    price: ticket.pricePEN,
    totalCapacity: ticket.capacity,
    maxPerPurchase: ticket.maxPerPurchase ?? null,
    isPresale: ticket.isPresale ?? false,
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
