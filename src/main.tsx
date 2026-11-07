import "./index.css";
import { createRoot } from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { CartContextProvider } from "./features/checkout/context/CartContext";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartContextProvider>
          <AppRouter />
        </CartContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);