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
    items: items.map((item) => ({
      ticketTypeId: item.id_ticket_type,
      quantity: item.quantity,
    })),
  };

  try {
    await api.post("/api/orders", payload);
  } catch (err: any) {
    throw err || new Error("El servicio de compra falló.");
  }
}
