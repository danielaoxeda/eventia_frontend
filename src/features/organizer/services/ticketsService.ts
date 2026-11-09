import apiClient from "../../../shared/services/api";
import type { TicketType } from "../types/organizer.types";
import { mapApiTicketToOrganizer, toApiTicketRequest, type ApiTicketType } from "./organizerMappers";

export const ticketsService = {
  async getTicketsByEvent(eventId: string): Promise<TicketType[]> {
    const response = await apiClient.get<ApiTicketType[]>(`/api/events/${eventId}/ticket-types`, {
      params: { includeInactive: true },
    });
    return (response.data || []).map(mapApiTicketToOrganizer);
  },

  async createTicketType(
    ticketData: Omit<TicketType, "id" | "soldCount"> & { id?: string }
  ): Promise<TicketType> {
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
    _eventId: string,
    ticketId: string,
    newStatus: TicketType["status"]
  ): Promise<TicketType> {
    const active = newStatus === "active";
    await apiClient.patch(`/api/ticket-types/${ticketId}/status`, null, { params: { active } });
    const updated = await apiClient.get<ApiTicketType>(`/api/ticket-types/${ticketId}`).then((r) => r.data);
    const mapped = mapApiTicketToOrganizer(updated);
    if (newStatus === "sold_out") mapped.status = "sold_out";
    return mapped;
  },

  async deleteTicketType(_eventId: string, ticketId: string): Promise<boolean> {
    await apiClient.delete(`/api/ticket-types/${ticketId}`);
    return true;
  },
};
