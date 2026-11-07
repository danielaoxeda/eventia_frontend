import api from "@/shared/services/api";
import type { CartItem, OrderPayload } from "../types/chekout.types";

/**
 * Confirma la compra: crea la orden en /orders y emite una entrada
 * en /tickets por cada unidad comprada. json-server asigna los id
 * (ignora los enviados), así que se usan los que devuelve la
 * respuesta para enlazar cada entrada con su orden.
 */
export async function createPurchase(
  items: CartItem[],
  userId: number,
  discountPct: number,
): Promise<void> {
  const subtotal = items.reduce(
    (acc, item) => acc + item.unit_price * item.quantity,
    0,
  );
  const discountTotal = (subtotal * discountPct) / 100;

  const { data: createdOrder } = await api.post<OrderPayload>("/orders", {
    id_user: userId,
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
  });
  const orderId = createdOrder.id;

  let unitIndex = 0;
  for (const item of items) {
    for (let unit = 0; unit < item.quantity; unit++) {
      unitIndex += 1;
      await api.post("/tickets", {
        id_order: orderId,
        id_user: userId,
        event_title: item.event_name,
        ticket_type: item.ticket_name,
        event_date: item.event_date,
        venue: item.venue,
        qr_code: `EVT-${orderId}-TCK${unitIndex}-SECURE`,
        status: "VIGENTE",
      });
    }
  }
}
