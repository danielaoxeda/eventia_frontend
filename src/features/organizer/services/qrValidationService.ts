import api from "../../../shared/services/api";
import type { QrValidationResult, TicketQrStatus } from "../types/organizer.types";

/**
 * Validación QR del organizador. Intenta endpoint backend y cae a respuesta segura.
 */
export const qrValidationService = {
  async validateTicket(qrCode: string): Promise<QrValidationResult> {
    const code = qrCode.trim();
    if (!code) return { valido: false, estado: "INVALIDO" };
    try {
      const { data } = await api.post<any>("/api/organizer/tickets/validate", { qrCode: code });
      const estado = (data?.estado || data?.status || "INVALIDO") as TicketQrStatus | "INVALIDO";
      const valido = !!data?.valido || estado === "USADO" || estado === "VIGENTE";
      return { valido, estado };
    } catch {
      try {
        const { data } = await api.get<any[]>(`/tickets?qr_code=${encodeURIComponent(code)}`);
        const ticket = data?.[0];
        if (!ticket) return { valido: false, estado: "INVALIDO" };
        if (ticket.status === "VIGENTE") {
          await api.patch(`/tickets/${ticket.id}`, { status: "USADO" });
          return { valido: true, estado: "USADO" };
        }
        return { valido: false, estado: ticket.status as TicketQrStatus };
      } catch {
        return { valido: false, estado: "INVALIDO" };
      }
    }
  },
};
