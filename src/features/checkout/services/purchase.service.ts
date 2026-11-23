import api from "@/shared/services/api";
import type { CartItem } from "../types/chekout.types";

export async function createPurchase(items: CartItem[]): Promise<void> {
  // El descuento promocional se calcula en el backend a partir del usuario
  // autenticado, por lo que aquí solo se envían las entradas seleccionadas.
  const payload = {
    paymentMethod: "CREDIT_CARD",
    items: items.map((item) => ({
      ticketTypeId: item.id_ticket_type,
      quantity: item.quantity,
    })),
  };

  await api.post("/api/orders", payload);
}
