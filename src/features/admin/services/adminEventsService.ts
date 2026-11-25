import api from "@/shared/services/api";
import type { AdminEventSummary, PageParams, PageResponse } from "../types/admin.types";

export const adminEventsService = {
  async getPendingEvents(params: PageParams): Promise<PageResponse<AdminEventSummary>> {
    const { data } = await api.get<PageResponse<AdminEventSummary>>("/api/admin/events", {
      params: {
        status: "PENDING",
        page: params.page,
        size: params.size,
        sort: "date,ASC",
      },
    });
    return data;
  },

  async approveEvent(id: number): Promise<void> {
    await api.patch(`/api/events/${id}/status`, null, { params: { status: "PUBLISHED" } });
  },

  async rejectEvent(id: number): Promise<void> {
    await api.patch(`/api/events/${id}/status`, null, { params: { status: "CANCELLED" } });
  },
};
