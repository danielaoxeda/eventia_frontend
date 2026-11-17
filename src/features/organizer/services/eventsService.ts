import apiClient from "../../../shared/services/api";
import type { OrganizerEvent } from "../types/organizer.types";
import {
  mapApiEventToOrganizer,
  toApiEventRequest,
  toBackendEventStatus,
  unwrapPage,
  type ApiEventDetail,
  type ApiEventSummary,
} from "./organizerMappers";

async function resolveCategoryId(category?: string | number): Promise<number> {
  if (typeof category === "number" && Number.isFinite(category)) return category;
  if (typeof category === "string" && /^\d+$/.test(category)) return Number(category);
  if (!category) return 1;
  try {
    const res = await apiClient.get<Array<{ id: number | string; name: string }>>("/api/categories");
    const targetCategory = String(category).toLowerCase();
    const found = (res.data || []).find((c) => c.name?.toLowerCase() === targetCategory);
    if (found?.id != null) return Number(found.id);
  } catch {
    // fallback below
  }
  return 1;
}

export const eventsService = {
  async getEvents(): Promise<OrganizerEvent[]> {
    const response = await apiClient.get<{ content?: ApiEventSummary[] } | ApiEventSummary[]>(
      "/api/events/organizer",
      { params: { includeInactive: true, size: 100 } }
    );
    return unwrapPage(response.data).map(mapApiEventToOrganizer);
  },

  async getEventById(id: string): Promise<OrganizerEvent | null> {
    const response = await apiClient.get<ApiEventDetail>(`/api/events/${id}`);
    return response.data ? mapApiEventToOrganizer(response.data) : null;
  },

  async toggleEventStatus(id: string, newStatus: OrganizerEvent["status"]): Promise<OrganizerEvent> {
    await apiClient.patch(`/api/events/${id}/status`, null, {
      params: { status: toBackendEventStatus(newStatus) },
    });
    const detail = await this.getEventById(id);
    if (!detail) throw new Error("Evento no encontrado");
    return detail;
  },

  async deactivateEvent(id: string, _reason: string): Promise<OrganizerEvent> {
    await apiClient.patch(`/api/events/${id}/active`, null, { params: { active: false } });
    const detail = await this.getEventById(id);
    if (!detail) throw new Error("Evento no encontrado");
    return detail;
  },

  async updateEvent(
    id: string,
    data: Partial<OrganizerEvent> & {
      categoryId?: number;
      description?: string;
      startTime?: string;
      endTime?: string;
      location?: string;
    }
  ): Promise<OrganizerEvent> {
    const current = await apiClient.get<ApiEventDetail>(`/api/events/${id}`).then((r) => r.data);
    const categoryId =
      data.categoryId ?? (await resolveCategoryId((data as any).category ?? current.categoryName));
    const payload = toApiEventRequest({
      title: data.title ?? current.title,
      description: (data as any).description ?? current.description ?? "",
      date: data.date ?? current.date,
      startTime: (data as any).startTime ?? data.time ?? current.startTime ?? "09:00",
      endTime: (data as any).endTime ?? current.endTime ?? "11:00",
      venue: data.venue ?? current.location ?? "",
      location: (data as any).location ?? data.venue ?? current.location ?? "",
      capacity: data.capacity ?? current.capacity ?? 0,
      bannerUrl: data.bannerUrl ?? current.bannerUrl ?? undefined,
      status: data.status ?? mapApiEventToOrganizer(current).status,
      categoryId,
    });
    const response = await apiClient.put<ApiEventDetail>(`/api/events/${id}`, payload);
    return mapApiEventToOrganizer(response.data);
  },

  async createEvent(data: {
    title: string;
    category?: string;
    categoryId?: number;
    venue?: string;
    city?: string;
    date?: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    bannerUrl?: string;
    status?: OrganizerEvent["status"];
    active?: boolean;
    capacity?: number;
    featured?: boolean;
    description?: string;
    location?: string;
  }): Promise<OrganizerEvent> {
    const categoryId = data.categoryId ?? (await resolveCategoryId(data.category));
    const payload = toApiEventRequest({ ...data, categoryId });
    const response = await apiClient.post<ApiEventDetail>("/api/events", payload);
    const created = mapApiEventToOrganizer(response.data);
    if (data.active === false) {
      return this.deactivateEvent(created.id, "Creado inactivo");
    }
    return created;
  },
};
