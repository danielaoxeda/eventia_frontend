import apiClient from "../../../shared/services/api";
import type { OrganizerEvent } from "../types/organizer.types";
import { USE_MOCK_DATA, MOCK_EVENTS } from "./organizerMock";

export const eventsService = {
  /**
   * Obtiene la lista completa de eventos del organizador
   */
  async getEvents(): Promise<OrganizerEvent[]> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 80));
      return [...MOCK_EVENTS];
    }

    try {
      const response = await apiClient.get<OrganizerEvent[]>("/events");
      return response.data;
    } catch (err) {
      console.warn("API offline, cargando eventos mock locales:", err);
      return [...MOCK_EVENTS];
    }
  },

  /**
   * Obtiene el detalle de un evento por su ID
   */
  async getEventById(id: string): Promise<OrganizerEvent | null> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 60));
      const event = MOCK_EVENTS.find((e) => e.id === id);
      return event ? { ...event } : null;
    }

    try {
      const response = await apiClient.get<OrganizerEvent>(`/events/${id}`);
      return response.data;
    } catch (err) {
      console.warn("API offline, cargando detalle mock local:", err);
      const event = MOCK_EVENTS.find((e) => e.id === id);
      return event ? { ...event } : null;
    }
  },

  /**
   * Cambia el estado publicado/oculto de un evento
   */
  async toggleEventStatus(id: string, newStatus: OrganizerEvent["status"]): Promise<OrganizerEvent> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 100));
      const index = MOCK_EVENTS.findIndex((e) => e.id === id);
      if (index !== -1) {
        MOCK_EVENTS[index].status = newStatus;
        return { ...MOCK_EVENTS[index] };
      }
      throw new Error("Evento no encontrado");
    }

    const response = await apiClient.patch<OrganizerEvent>(`/events/${id}`, {
      status: newStatus,
    });
    return response.data;
  },

  /**
   * Inactiva un evento (soft delete - Regla RN04)
   */
  async deactivateEvent(id: string, _reason: string): Promise<OrganizerEvent> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 120));
      const index = MOCK_EVENTS.findIndex((e) => e.id === id);
      if (index !== -1) {
        MOCK_EVENTS[index].active = false;
        MOCK_EVENTS[index].status = "inactive";
        return { ...MOCK_EVENTS[index] };
      }
      throw new Error("Evento no encontrado");
    }

    const response = await apiClient.patch<OrganizerEvent>(`/events/${id}`, {
      active: false,
      status: "inactive",
    });
    return response.data;
  },

  /**
   * Actualiza los datos de un evento
   */
  async updateEvent(id: string, data: Partial<OrganizerEvent>): Promise<OrganizerEvent> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 150));
      const index = MOCK_EVENTS.findIndex((e) => e.id === id);
      if (index !== -1) {
        MOCK_EVENTS[index] = { ...MOCK_EVENTS[index], ...data };
        return { ...MOCK_EVENTS[index] };
      }
      throw new Error("Evento no encontrado");
    }

    const response = await apiClient.patch<OrganizerEvent>(`/events/${id}`, data);
    return response.data;
  },

  /**
   * Crea un nuevo evento
   */
  async createEvent(data: {
    title: string;
    category?: string;
    venue?: string;
    city?: string;
    date?: string;
    time?: string;
    bannerUrl?: string;
    status?: OrganizerEvent["status"];
    active?: boolean;
    capacity?: number;
    featured?: boolean;
    description?: string;
  }): Promise<OrganizerEvent> {
    const year = new Date().getFullYear();
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const newEvent: OrganizerEvent = {
      id: `EVT-${year}-LIM-${randomCodeNum}`,
      code: `EVT-${randomCodeNum}`,
      title: data.title || "Nuevo Evento",
      category: data.category || "Música & Conciertos",
      venue: data.venue || "Arena 1 Costa Verde, San Miguel",
      city: data.city || "Lima",
      date: data.date || new Date().toISOString().split("T")[0],
      time: data.time || "20:00",
      bannerUrl:
        data.bannerUrl ||
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
      status: data.status || "published",
      active: data.active ?? true,
      capacity: data.capacity || 5000,
      ticketsSold: 0,
      totalRevenue: 0,
      featured: data.featured ?? false,
    };

    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 180));
      MOCK_EVENTS.unshift(newEvent);
      return newEvent;
    }

    const response = await apiClient.post<OrganizerEvent>("/events", newEvent);
    return response.data;
  },
};
