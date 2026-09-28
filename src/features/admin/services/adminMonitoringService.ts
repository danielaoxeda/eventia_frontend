import api from "../../../shared/services/api";
import type {
  ActiveEvent,
  KpiMetric,
  MonthlyTicket,
  MonitoringDashboardData,
  SalesTrend,
} from "../types/admin.types";

/**
 * Datos semilla locales para métricas y gráficos del panel de monitoreo
 * utilizados como respaldo (fallback) si el servidor json-server está apagado.
 */
const MOCK_KPIS: KpiMetric[] = [
  {
    id: "kpi-ingresos",
    label: "INGRESOS TOTALES",
    value: "S/ 142,850.00",
    badge: {
      text: "+12.4% vs. mes anterior",
      positive: true,
    },
    iconName: "wallet",
    colorVariant: "indigo",
  },
  {
    id: "kpi-ordenes",
    label: "ÓRDENES REGISTRADAS",
    value: "3,842",
    subtext: "Total compras en plataforma",
    iconName: "receipt",
    colorVariant: "blue",
  },
  {
    id: "kpi-tickets",
    label: "TICKETS EMITIDOS",
    value: "8,490",
    subtext: "Entradas digitales generadas",
    iconName: "ticket",
    colorVariant: "purple",
  },
  {
    id: "kpi-usuarios",
    label: "USUARIOS ACTIVOS",
    value: "4,120",
    subtext: "Clientes y organizadores activos",
    iconName: "users",
    colorVariant: "rose",
  },
];

const MOCK_SALES_TREND: SalesTrend[] = [
  { day: "Día 1", ingresos: 1250, formatted: "S/ 1,250" },
  { day: "Día 3", ingresos: 1480, formatted: "S/ 1,480" },
  { day: "Día 5", ingresos: 1720, formatted: "S/ 1,720" },
  { day: "Día 7", ingresos: 2310, formatted: "S/ 2,310" },
  { day: "Día 10", ingresos: 2190, formatted: "S/ 2,190" },
  { day: "Día 12", ingresos: 2840, formatted: "S/ 2,840" },
  { day: "Día 15", ingresos: 3200, formatted: "S/ 3,200" },
  { day: "Día 18", ingresos: 2980, formatted: "S/ 2,980" },
  { day: "Día 20", ingresos: 3650, formatted: "S/ 3,650" },
  { day: "Día 22", ingresos: 4120, formatted: "S/ 4,120" },
  { day: "Día 25", ingresos: 4890, formatted: "S/ 4,890" },
  { day: "Día 28", ingresos: 5420, formatted: "S/ 5,420" },
  { day: "Día 30", ingresos: 6180, formatted: "S/ 6,180" },
];

const MOCK_MONTHLY_TICKETS: MonthlyTicket[] = [
  { month: "Ene", tickets: 1100, displayLabel: "1.1k" },
  { month: "Feb", tickets: 1250, displayLabel: "1.2k" },
  { month: "Mar", tickets: 1400, displayLabel: "1.4k" },
  { month: "Abr", tickets: 1750, displayLabel: "1.7k" },
  { month: "May", tickets: 2800, displayLabel: "2.8k", highlight: true },
  { month: "Jun", tickets: 1950, displayLabel: "1.9k" },
];

const MOCK_ACTIVE_EVENTS: ActiveEvent[] = [
  {
    id: "evt-01",
    titulo: "Festival de Salsa All Stars 2024",
    categoria: "Conciertos",
    organizador: "Live Producciones SAC",
    ruc: "20548194321",
    entradasVendidas: 3850,
    aforoTotal: 5000,
    recaudacion: 346500,
    tasaComision: 0.08,
    comision: 27720,
    estado: "En Curso",
  },
  {
    id: "evt-02",
    titulo: "Tech Summit Lima 2024",
    categoria: "Conferencias",
    organizador: "Innovación Perú SAC",
    ruc: "20601948231",
    entradasVendidas: 820,
    aforoTotal: 1000,
    recaudacion: 123000,
    tasaComision: 0.1,
    comision: 12300,
    estado: "Activo",
  },
  {
    id: "evt-03",
    titulo: "Obra Teatral: Bodas de Sangre",
    categoria: "Teatro",
    organizador: "Teatro Municipal de Lima",
    ruc: "20100084729",
    entradasVendidas: 450,
    aforoTotal: 600,
    recaudacion: 31500,
    tasaComision: 0.07,
    comision: 2205,
    estado: "Activo",
  },
  {
    id: "evt-04",
    titulo: "Maratón Nocturna Miraflores 10K",
    categoria: "Deportes",
    organizador: "Club Deportivo Running Perú",
    ruc: "20491823741",
    entradasVendidas: 2900,
    aforoTotal: 3000,
    recaudacion: 145000,
    tasaComision: 0.06,
    comision: 8700,
    estado: "Próximo",
  },
  {
    id: "evt-05",
    titulo: "Festival Gastronómico Sabores del Norte",
    categoria: "Gastronomía",
    organizador: "Asociación Culinaria del Perú",
    ruc: "20391847291",
    entradasVendidas: 1800,
    aforoTotal: 2500,
    recaudacion: 54000,
    tasaComision: 0.05,
    comision: 2700,
    estado: "En Curso",
  },
  {
    id: "evt-06",
    titulo: "Expo Café & Chocolate 2024",
    categoria: "Ferias",
    organizador: "Cámara Peruana del Café",
    ruc: "20100456789",
    entradasVendidas: 4100,
    aforoTotal: 5000,
    recaudacion: 123000,
    tasaComision: 0.1,
    comision: 12300,
    estado: "Activo",
  },
];

/**
 * Servicio encargado de la comunicación con la API dummy (json-server / db.json)
 * para el panel de control operativo y KPIs de la plataforma.
 */
export const adminMonitoringService = {
  /**
   * Obtiene la data consolidada del panel de monitoreo desde GET /admin_monitoring
   */
  async getDashboardData(): Promise<MonitoringDashboardData> {
    try {
      const response = await api.get<MonitoringDashboardData>("/admin_monitoring");
      if (response.data && response.data.kpis) {
        return response.data;
      }
      return {
        kpis: MOCK_KPIS,
        salesTrend: MOCK_SALES_TREND,
        monthlyTickets: MOCK_MONTHLY_TICKETS,
        activeEvents: MOCK_ACTIVE_EVENTS,
        totalActiveEventsCount: 42,
      };
    } catch {
      return {
        kpis: MOCK_KPIS,
        salesTrend: MOCK_SALES_TREND,
        monthlyTickets: MOCK_MONTHLY_TICKETS,
        activeEvents: MOCK_ACTIVE_EVENTS,
        totalActiveEventsCount: 42,
      };
    }
  },
};
