import apiClient from "../../../shared/services/api";
import type { TicketType } from "../types/organizer.types";
import { USE_MOCK_DATA, MOCK_TICKETS } from "./organizerMock";

export const ticketsService = {
  /**
   * Obtiene la lista de tipos de ticket/tarifas configuradas para un evento
   */
  async getTicketsByEvent(eventId: string): Promise<TicketType[]> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 90));
      return MOCK_TICKETS[eventId] ? [...MOCK_TICKETS[eventId]] : [];
    }

    try {
      const response = await apiClient.get<TicketType[]>(`/organizer_tickets?eventId=${eventId}`);
      return response.data;
    } catch (err) {
      console.warn("API offline, cargando tarifas mock locales:", err);
      return MOCK_TICKETS[eventId] ? [...MOCK_TICKETS[eventId]] : [];
    }
  },

  /**
   * Crea un nuevo tipo de ticket / tarifa para un evento
   */
  async createTicketType(
    ticketData: Omit<TicketType, "id" | "soldCount"> & { id?: string }
  ): Promise<TicketType> {
    const randomId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: TicketType = {
      ...ticketData,
      id: ticketData.id || randomId,
      soldCount: 0,
      status: ticketData.status || "active",
    };

    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 120));
      if (!MOCK_TICKETS[ticketData.eventId]) {
        MOCK_TICKETS[ticketData.eventId] = [];
      }
      MOCK_TICKETS[ticketData.eventId].push(newTicket);
      return newTicket;
    }

    const response = await apiClient.post<TicketType>("/organizer_tickets", newTicket);
    return response.data;
  },

  /**
   * Actualiza una tarifa/tipo de ticket existente
   */
  async updateTicketType(
    eventId: string,
    ticketId: string,
    ticketData: Partial<TicketType>
  ): Promise<TicketType> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 120));
      const list = MOCK_TICKETS[eventId] || [];
      const index = list.findIndex((t) => t.id === ticketId);
      if (index !== -1) {
        list[index] = { ...list[index], ...ticketData };
        return { ...list[index] };
      }
      throw new Error("Tarifa no encontrada");
    }

    const response = await apiClient.patch<TicketType>(
      `/organizer_tickets/${ticketId}`,
      ticketData
    );
    return response.data;
  },

  /**
   * Cambia el estado de venta de una tarifa (activo, pausado, agotado)
   */
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

    const response = await apiClient.patch<TicketType>(
      `/organizer_tickets/${ticketId}`,
      {
        status: newStatus,
      }
    );
    return response.data;
  },

  /**
   * Elimina un tipo de ticket si no tiene ventas registradas
   */
  async deleteTicketType(eventId: string, ticketId: string): Promise<boolean> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 100));
      if (MOCK_TICKETS[eventId]) {
        MOCK_TICKETS[eventId] = MOCK_TICKETS[eventId].filter((t) => t.id !== ticketId);
      }
      return true;
    }

    await apiClient.delete(`/organizer_tickets/${ticketId}`);
    return true;
  },
};
