import apiClient from "../../../shared/services/api";
import type { AuditLogEntry } from "../types/organizer.types";
import { USE_MOCK_DATA } from "./organizerMock";

export const auditService = {
  /**
   * Obtiene el log de auditoría
   */
  async getAuditLog(eventId: string): Promise<AuditLogEntry[]> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 80));
      return [];
    }

    const response = await apiClient.get<AuditLogEntry[]>(
      `/organizer/events/${eventId}/audit-log`
    );
    return response.data;
  },
};
