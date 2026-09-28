/** Identificador de localidad (viene de `ticket_types` en db.json). */
export type TicketTierId = number;

/** Localidad con precios (base y regular tachado) para el checkout. */
export interface TicketTier {
  id: number;
  name: string;
  description: string;
  note: string;
  price: number;
  regularPrice: number;
  dot: string;
}

/** Ficha del evento armada desde db.json para el detalle. */
export interface EventDetailData {
  id: number;
  title: string;
  venue: string;
  city: string;
  /* Fecha legible */
  dateLabel: string;
  /* Mes abreviado (ej. "NOV") */
  month: string;
  day: string;
  tiers: TicketTier[];
}

/** Pestañas de la ficha: mapa, artistas y políticas. */
export type DetailTabId = "zones" | "info" | "policies";

/** Resumen de compra calculado en la página. */
export interface OrderTotals {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
}
