import { useState, type ReactNode } from "react";
import type { CartItem } from "../types/chekout.types";
import { CartContext } from "../hooks/useCartContext";

interface CartProviderProps {
  children: ReactNode;
}

export function CartContextProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  //Funcion para agregar un nuevo ticket al carrito
  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      //1ero verificamos si el objeto a añadir ya existe previamente en el carrito
      const existing = prev.find(
        (item) => item.id_ticket_type === newItem.id_ticket_type,
      );

      //Si existe, entonces solo sumamos la cantidad del mismo tipo de ticket
      if (existing) {
        return prev.map((item) =>
          item.id_ticket_type === newItem.id_ticket_type
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
      }

      return [...prev, newItem];
    });
  };

  //Funcion para remover un ticket del carrito
  const removeFromCart = (idItem: number) => {
    setItems((prev) => prev.filter((item) => item.id_ticket_type !== idItem));
  };

  //Funcion para limpiar el carrito
  const clearCart = () => {
    setItems([]);
  };

  //Calculo real del total sin aplicar descuento
  const totalAmount: number = items.reduce(
    (acc, item) => acc + item.unit_price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}
