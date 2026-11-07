import api from "../../../shared/services/api";
import type { TicketItem, QrValidationResult } from "../types/organizer.types";

/**
 * Servicio de validación de entradas QR para el organizador.
 * Consume la colección 'tickets' de la API y actualiza el estado a USADO.
 */
export const qrValidationService = {
  /**
   * Consulta el ticket por QR y actualiza su estado si está VIGENTE.
   */
  async validateTicket(qrCode: string): Promise<QrValidationResult> {
    try {
      const { data } = await api.get<TicketItem[]>(
        `/tickets?qr_code=${encodeURIComponent(qrCode.trim())}`
      );

      const ticket = data?.[0];

      // Si no existe en el sistema
      if (!ticket) {
        return { valido: false, estado: "INVALIDO" };
      }

      // Si está VIGENTE: se marca como USADO en la API y se acepta el ingreso
      if (ticket.status === "VIGENTE") {
        await api.patch(`/tickets/${ticket.id}`, { status: "USADO" });
        return { valido: true, estado: "USADO" };
      }

      // Si ya es USADO o ANULADO: se rechaza retornando su estado
      return { valido: false, estado: ticket.status };
    } catch {
      return { valido: false, estado: "INVALIDO" };
    }
  },
};
