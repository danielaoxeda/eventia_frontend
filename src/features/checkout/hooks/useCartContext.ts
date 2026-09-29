import { createContext, useContext } from "react";
import type { CartContexType } from "../types/chekout.types";

export const CartContext = createContext<CartContexType | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCartContext debe ser usado dentro de un CartContextProvider",
    );
  }
  return context;
}
