import api from "@/shared/services/api";
import type { CartItem } from "../types/chekout.types";

export async function createPurchase(
  items: CartItem[],
  _userId: number,
  discountPct: number,
): Promise<void> {
  // Payload alineado con OrderRequestDto del backend:
  // { paymentMethod, items: [{ ticketTypeId, quantity }] }
  const payload = {
    paymentMethod: "CREDIT_CARD",
    items: items.map((item) => ({
      ticketTypeId: item.id_ticket_type,
      quantity: item.quantity,
    })),
  };

  const attempts = ["/api/orders", "/api/orders/checkout", "/api/checkout", "/orders"];
  let lastErr: any;
  for (const path of attempts) {
    try {
      await api.post(path, payload);
      return;
    } catch (err: any) {
      lastErr = err;
      if (err?.response?.status && ![404, 405, 500, 501].includes(err.response.status)) {
        throw err;
      }
    }
  }
  throw lastErr || new Error("El servicio de compra no está disponible en el backend.");
}
