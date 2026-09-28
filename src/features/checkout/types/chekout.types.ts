export interface CartItem {
  id_ticket_type: number;
  ticket_name: string;
  event_name: string;
  event_date: string;
  venue: string;
  unit_price: number;
  quantity: number;
}

export interface CartContexType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

export interface OrderPayload {
  id: string;
  id_user: number;
  order_date: string;
  payment_method: string;
  total_amount: number;
  status: string;
  order_details: OrderDetailPayload[];
}

export interface OrderDetailPayload {
  id_ticket_type: number;
  ticket_name: string;
  quantity: number;
  unit_price: number;
  discount_applied: number;
}

export interface CardForm {
  number: string;
  exp: string;
  cvv: string;
  name: string;
  cuotas: string;
}

export interface CardErrors {
  number: string;
  exp: string;
  cvv: string;
  name: string;
}