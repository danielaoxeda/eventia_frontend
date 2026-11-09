import apiClient from "../../../shared/services/api";
import type { AuditLogEntry } from "../types/organizer.types";

export const auditService = {
  async getAuditLog(eventId: string): Promise<AuditLogEntry[]> {
    try {
      const response = await apiClient.get<AuditLogEntry[]>(`/api/organizer/events/${eventId}/audit-log`);
      return response.data || [];
    } catch {
      // Endpoint opcional del backend
      return [];
    }
  },
};
