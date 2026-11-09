import apiClient from "../../../shared/services/api";
import type { AuditLogEntry } from "../types/organizer.types";
import { USE_MOCK_DATA } from "./organizerMock";

export const auditService = {
  async getAuditLog(eventId: string): Promise<AuditLogEntry[]> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 80));
      return [];
    }
    try {
      const response = await apiClient.get<AuditLogEntry[]>(`/api/organizer/events/${eventId}/audit-log`);
      return response.data || [];
    } catch {
      // Endpoint puede no estar implementado aún en backend.
      return [];
    }
  },
};
