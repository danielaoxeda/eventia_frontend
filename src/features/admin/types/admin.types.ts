// Respuesta paginada compatible con Page<T> de Spring Boot
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export type PageParams<TFilters extends object = object> = {
  page: number;
  size: number;
} & TFilters;

export interface AdminCategory {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  active: boolean;
}

export interface CategoryFilters {
  search?: string;
  active?: boolean;
}

export type UserRole = "ADMIN" | "ORGANIZER" | "USER";

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  cellphone: string | null;
  active: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  cellphone: string;
}

export interface CreateUserFormData extends UserFormData {
  password: string;
}

export interface UserFilters {
  search?: string;
  active?: boolean;
}

export interface KpiMetric {
  value: number;
  percentageChange: number;
  previousMonthValue: number;
}

export interface DashboardKpiResponse {
  totalRevenue: KpiMetric;
  processedOrders: KpiMetric;
  issuedTickets: KpiMetric;
  activeOrganizers: KpiMetric;
}

export interface RevenueTimelineResponse {
  period: string;
  revenue: number;
  ordersCount: number;
}

export interface TicketFlowResponse {
  period: string;
  issuedTickets: number;
  redeemedTickets: number;
}

export type EventStatus =
  | "PENDING"
  | "DRAFT"
  | "PUBLISHED"
  | "HIDDEN"
  | "CANCELLED"
  | "FINISHED";

export interface ActiveEventResponse {
  id: number;
  title: string;
  categoryName: string;
  organizerName: string;
  ticketsSold: number;
  capacity: number;
  status: EventStatus;
}

export interface MonitoringDashboardResponse {
  kpis: DashboardKpiResponse;
  revenueTimeline: RevenueTimelineResponse[];
  ticketFlow: TicketFlowResponse[];
  activeEvents: ActiveEventResponse[];
}
