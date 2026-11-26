export type EventStatus = "pending" | "published" | "cancelled" | "finished";

export interface OrganizerEvent {
  id: string;
  code: string;
  title: string;
  category: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  bannerUrl: string;
  status: EventStatus;
  active: boolean;
  capacity: number;
  ticketsSold: number;
  totalRevenue: number;
  featured?: boolean;
}

export interface OrganizerKpi {
  activeEvents: number;
  activeEventsChange?: number | null;
  ticketsSold: number;
  ticketsSoldChange?: number | null;
  totalRevenuePEN: number;
  totalRevenueChange?: number | null;
  occupancyRate: number;
  occupancyRateChange?: number | null;
}

export interface DailySalesDataPoint {
  day: string;
  date: string;
  totalPEN: number;
  ticketsSold: number;
}

export interface ZoneDistributionDataPoint {
  zoneName: string;
  soldCount: number;
  totalCapacity: number;
  percentage: number;
  color: string;
}

export interface OrganizerDashboardData {
  kpis: OrganizerKpi;
  dailySales: DailySalesDataPoint[];
  zoneDistribution: ZoneDistributionDataPoint[];
  recentEvents: OrganizerEvent[];
  activeShift: {
    venue: string;
    gateSystemStatus: "online" | "syncing" | "offline";
    generalCapacityWarning?: string;
  };
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  zone: string;
  pricePEN: number;
  capacity: number;
  soldCount: number;
  status: "active" | "paused";
  saleStartDate?: string;
  saleEndDate?: string;
}

export interface EventNotification {
  eventId: number | string;
  title: string;
  organizerName: string;
  categoryName?: string | null;
  status: string;
  message: string;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface EventFormData {
  title: string;
  category: string;
  capacity: number;
  venue: string;
  address: string;
  eventDate: string;
  doorsOpen: string;
  showStart: string;
  salesClose: string;
  description: string;
  restrictions: string[];
  bannerDesktopUrl: string;
  bannerMobileUrl: string;
  isPublic: boolean;
}

