/**
 * Contratos del módulo de Administración (Backoffice).
 * Estrictamente alineados con las entidades JPA del backend Spring Boot:
 * Category, User (UserRole), Event, TicketType, Order, OrderDetail y Ticket.
 */

// ───────────────────────────── Paginación ─────────────────────────────

// Compatible con Spring Boot Page<T>. La numeración de páginas comienza en 0.
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Parámetros de paginación (page base 0) combinables con los filtros de cada listado
export type PageParams<TFilters extends object = object> = {
  page: number;
  size: number;
} & TFilters;

// ───────────────────────────── Categorías (Entity: Category) ─────────────────────────────

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

// ───────────────────────────── Organizadores (Entity: User / Enum: UserRole) ─────────────────────────────

export type UserRole = "ADMIN" | "ORGANIZER" | "USER";

// Respuesta pública de User: nunca incluye password
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

// Actualización de un organizador: no incluye password ni role
export interface UserFormData {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  cellphone: string;
}

// Alta de un organizador: añade la contraseña provisional. El backend asigna el rol ORGANIZER.
export interface CreateUserFormData extends UserFormData {
  password: string;
}

export interface UserFilters {
  search?: string;
  active?: boolean;
}

// ───────────────────────────── Monitoreo (Entities: Order, Ticket, User, Event) ─────────────────────────────

export interface KpiMetric {
  value: number;
  percentageChange: number;
  previousMonthValue: number;
}

/**
 * 4 KPIs superiores del Dashboard de Monitoreo:
 * - totalRevenue: SUM(orders.total_amount)
 * - processedOrders: COUNT(orders.id)
 * - issuedTickets: COUNT(tickets.id)
 * - activeOrganizers: COUNT(users.id WHERE role = 'ORGANIZER' AND active = true)
 */
export interface DashboardKpiResponse {
  totalRevenue: KpiMetric;
  processedOrders: KpiMetric;
  issuedTickets: KpiMetric;
  activeOrganizers: KpiMetric;
}

/**
 * Punto de serie temporal para el gráfico de Ingresos Históricos.
 * Fuente: Orders.total_amount agrupado por fecha o mes (Orders.created_at).
 */
export interface RevenueTimelineResponse {
  period: string;
  revenue: number;
  ordersCount: number;
}

/**
 * Punto de serie comparativa para el gráfico de Tickets Emitidos vs Validados.
 * Fuente: Tickets.created_at (emitidos) vs Tickets.redeemed_at (validados).
 */
export interface TicketFlowResponse {
  period: string;
  issuedTickets: number;
  redeemedTickets: number;
}

/**
 * Resumen de evento activo en plataforma.
 * Fuente: Event + Category.name + (User.firstName + User.lastName) + ocupación calculada desde TicketType/Ticket.
 */
export interface ActiveEventResponse {
  id: number;
  title: string;
  categoryName: string;
  organizerName: string;
  ticketsSold: number;
  capacity: number;
  status: string;
}

export interface MonitoringDashboardResponse {
  kpis: DashboardKpiResponse;
  revenueTimeline: RevenueTimelineResponse[];
  ticketFlow: TicketFlowResponse[];
  activeEvents: ActiveEventResponse[];
}
