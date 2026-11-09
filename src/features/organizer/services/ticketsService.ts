import apiClient from "../../../shared/services/api";
import type { TicketType } from "../types/organizer.types";
import { USE_MOCK_DATA, MOCK_TICKETS } from "./organizerMock";
import { mapApiTicketToOrganizer, toApiTicketRequest, type ApiTicketType } from "./organizerMappers";

export const ticketsService = {
  async getTicketsByEvent(eventId: string): Promise<TicketType[]> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 90));
      return MOCK_TICKETS[eventId] ? [...MOCK_TICKETS[eventId]] : [];
    }
    const response = await apiClient.get<ApiTicketType[]>(`/api/events/${eventId}/ticket-types`, {
      params: { includeInactive: true },
    });
    return (response.data || []).map(mapApiTicketToOrganizer);
  },

  async createTicketType(
    ticketData: Omit<TicketType, "id" | "soldCount"> & { id?: string }
  ): Promise<TicketType> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 120));
      const randomId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: TicketType = {
        ...ticketData,
        id: ticketData.id || randomId,
        soldCount: 0,
        status: ticketData.status || "active",
      };
      if (!MOCK_TICKETS[ticketData.eventId]) MOCK_TICKETS[ticketData.eventId] = [];
      MOCK_TICKETS[ticketData.eventId].push(newTicket);
      return newTicket;
    }
    const response = await apiClient.post<ApiTicketType>(
      `/api/events/${ticketData.eventId}/ticket-types`,
      toApiTicketRequest(ticketData)
    );
    return mapApiTicketToOrganizer(response.data);
  },

  async updateTicketType(
    _eventId: string,
    ticketId: string,
    ticketData: Partial<TicketType>
  ): Promise<TicketType> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 120));
      const list = MOCK_TICKETS[_eventId] || [];
      const index = list.findIndex((t) => t.id === ticketId);
      if (index !== -1) {
        list[index] = { ...list[index], ...ticketData };
        return { ...list[index] };
      }
      throw new Error("Tarifa no encontrada");
    }
    const current = await apiClient.get<ApiTicketType>(`/api/ticket-types/${ticketId}`).then((r) => r.data);
    const payload = toApiTicketRequest({
      name: ticketData.name ?? current.name,
      zone: ticketData.zone ?? current.zone ?? undefined,
      pricePEN: ticketData.pricePEN ?? current.price ?? 0,
      capacity: ticketData.capacity ?? current.totalCapacity ?? 0,
      maxPerPurchase: ticketData.maxPerPurchase ?? current.maxPerPurchase ?? undefined,
      isPresale: ticketData.isPresale ?? current.isPresale ?? false,
      saleStartDate: ticketData.saleStartDate ?? current.saleStartDate ?? undefined,
      saleEndDate: ticketData.saleEndDate ?? current.saleEndDate ?? undefined,
    });
    const response = await apiClient.put<ApiTicketType>(`/api/ticket-types/${ticketId}`, payload);
    return mapApiTicketToOrganizer(response.data);
  },

  async toggleTicketStatus(
    eventId: string,
    ticketId: string,
    newStatus: TicketType["status"]
  ): Promise<TicketType> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 100));
      const list = MOCK_TICKETS[eventId] || [];
      const index = list.findIndex((t) => t.id === ticketId);
      if (index !== -1) {
        list[index].status = newStatus;
        return { ...list[index] };
      }
      throw new Error("Tarifa no encontrada");
    }
    // Backend soporta active boolean; "paused"/"sold_out" se representan mejor en UI.
    // Mantenemos sold_out localmente visible tras recarga por datos, y active=false para pausado.
    const active = newStatus === "active";
    await apiClient.patch(`/api/ticket-types/${ticketId}/status`, null, { params: { active } });
    const updated = await apiClient.get<ApiTicketType>(`/api/ticket-types/${ticketId}`).then((r) => r.data);
    const mapped = mapApiTicketToOrganizer(updated);
    if (newStatus === "sold_out") mapped.status = "sold_out";
    return mapped;
  },

  async deleteTicketType(_eventId: string, ticketId: string): Promise<boolean> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 100));
      if (MOCK_TICKETS[_eventId]) {
        MOCK_TICKETS[_eventId] = MOCK_TICKETS[_eventId].filter((t) => t.id !== ticketId);
      }
      return true;
    }
    await apiClient.delete(`/api/ticket-types/${ticketId}`);
    return true;
  },
};
