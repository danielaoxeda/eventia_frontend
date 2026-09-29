import { dashboardService } from "./dashboardService";
import { eventsService } from "./eventsService";
import { ticketsService } from "./ticketsService";
import { auditService } from "./auditService";

export * from "./dashboardService";
export * from "./eventsService";
export * from "./ticketsService";
export * from "./auditService";
export * from "./organizerMock";

/**
 * Objeto unificado del servicio del Organizador (Patrón Facade)
 */
export const organizerService = {
  ...dashboardService,
  ...eventsService,
  ...ticketsService,
  ...auditService,
};

export default organizerService;
