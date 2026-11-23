import { dashboardService } from "./dashboardService";
import { eventsService } from "./eventsService";
import { ticketsService } from "./ticketsService";

export * from "./dashboardService";
export * from "./eventsService";
export * from "./ticketsService";

/**
 * Objeto unificado del servicio del Organizador (Patrón Facade)
 */
export const organizerService = {
  ...dashboardService,
  ...eventsService,
  ...ticketsService,
};

export default organizerService;
