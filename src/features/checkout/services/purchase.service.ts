import api from "@/shared/services/api";
import type { CartItem } from "../types/chekout.types";

export async function createPurchase(
  items: CartItem[],
  _userId: number,
  discountPct: number,
): Promise<void> {
  const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
  const discountTotal = (subtotal * discountPct) / 100;
  const payload = {
    paymentMethod: "CREDIT_CARD",
    totalAmount: subtotal - discountTotal,
    discountPct,
    items: items.map((item) => ({
      ticketTypeId: item.id_ticket_type,
      ticketTypeName: item.ticket_name,
      eventName: item.event_name,
      eventDate: item.event_date,
      venue: item.venue,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      discountApplied: (item.unit_price * item.quantity * discountPct) / 100,
    })),
    // compat legacy/json-server
    order_date: new Date().toISOString(),
    payment_method: "CREDIT_CARD",
    total_amount: subtotal - discountTotal,
    status: "COMPLETED",
    order_details: items.map((item) => ({
      id_ticket_type: item.id_ticket_type,
      ticket_name: item.ticket_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_applied: (item.unit_price * item.quantity * discountPct) / 100,
    })),
  };

  const attempts = ["/api/checkout", "/api/orders/checkout", "/api/orders", "/orders"];
  let lastErr: any;
  for (const path of attempts) {
    try {
      await api.post(path, payload);
      return;
    } catch (err: any) {
      lastErr = err;
      if (err?.response?.status && ![404, 405, 501].includes(err.response.status)) throw err;
    }
  }
  throw lastErr || new Error("El servicio de compra no está disponible en el backend.");
}
