export type EventStatus = "draft" | "published" | "hidden" | "almost_sold_out" | "sold_out" | "inactive";

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
  status: "active" | "paused" | "sold_out";
  saleStartDate?: string;
  saleEndDate?: string;
  isPresale?: boolean;
  maxPerPurchase?: number;
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

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
  metadata?: string;
}

// Control de Acceso y Validación QR
export type TicketQrStatus = "VIGENTE" | "USADO" | "ANULADO";

/**
 * Modelo de ticket para control de accesos
 */
export interface TicketItem {
  id: string;
  id_order: string;
  id_user: number;
  event_title: string;
  ticket_type: string;
  event_date: string;
  venue: string;
  qr_code: string;
  status: TicketQrStatus;
}

/**
 * Resultado directo de la validación
 */
export interface QrValidationResult {
  valido: boolean;
  estado: TicketQrStatus | "INVALIDO";
}

