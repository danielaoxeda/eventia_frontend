/**
 * Definiciones de tipos para el módulo de Administración (Backoffice).
 * Modela categorías, usuarios (organizadores/clientes) y métricas de monitoreo.
 */

// Estado operativo de una categoría en la plataforma
export type CategoryStatus = "Activa" | "Inactiva";

// Modelo de datos de una Categoría en el catálogo del Admin
export interface AdminCategory {
  id: string;
  numeroId: number;
  nombre: string;
  descripcion: string;
  estado: CategoryStatus;
  ultimaActualizacion: string;
}

// Datos transferidos desde el formulario para crear o editar una categoría
export interface CategoryFormData {
  nombre: string;
  descripcion: string;
  estado: CategoryStatus;
}

// Roles de usuario en el sistema: Solo 'Organizador' puede ser creado desde este panel
export type UserRole = "Organizador" | "Cliente";
export type UserStatus = "Activo" | "Inactivo";

// Modelo de usuario visualizado en la tabla de administración
export interface AdminUser {
  id: string;
  codigo: string;
  nombre: string;
  email: string;
  iniciales: string;
  dni: string;
  telefono: string;
  rol: UserRole;
  fechaRegistro: string;
  estado: UserStatus;
  password?: string;
}

// Datos para registrar o actualizar un usuario (restringido a Organizador para nuevas altas)
export interface UserFormData {
  nombre: string;
  email: string;
  dni: string;
  telefono: string;
  rol: "Organizador" | UserRole;
  password?: string;
}

// Variantes visuales para las tarjetas de métricas
export type MetricColorVariant = "indigo" | "blue" | "purple" | "rose";
export type EventStatus = "En Curso" | "Activo" | "Próximo" | "Finalizado";

// Indicador clave de rendimiento (KPI)
export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  badge?: {
    text: string;
    positive: boolean;
  };
  iconName: "wallet" | "receipt" | "ticket" | "users";
  colorVariant: MetricColorVariant;
}

// Punto de datos para el gráfico de ingresos en el tiempo
export interface SalesTrend {
  day: string;
  ingresos: number;
  formatted: string;
}

// Emisión mensual de entradas para el gráfico de barras
export interface MonthlyTicket {
  month: string;
  tickets: number;
  displayLabel: string;
  highlight?: boolean;
}

// Evento en supervisión operativa por la administración
export interface ActiveEvent {
  id: string;
  titulo: string;
  categoria: string;
  organizador: string;
  ruc: string;
  entradasVendidas: number;
  aforoTotal: number;
  recaudacion: number;
  tasaComision: number;
  comision: number;
  estado: EventStatus;
}

// Estructura completa retornada por el endpoint de monitoreo
export interface MonitoringDashboardData {
  kpis: KpiMetric[];
  salesTrend: SalesTrend[];
  monthlyTickets: MonthlyTicket[];
  activeEvents: ActiveEvent[];
  totalActiveEventsCount: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export type SalesDataPoint = SalesTrend;
export type MonthlyTicketData = MonthlyTicket;
