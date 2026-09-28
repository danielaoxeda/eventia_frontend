import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CategoriesPage from "../features/categories/pages/CategoriesPage";
import CatalogPage from "../features/events/pages/CatalogPage";
import EventDetailPage from "../features/event-detail/pages/EventDetailPage";
import LoginPage from "../features/login/pages/LoginPage";
import RegisterPage from "../features/register/pages/RegisterPage";

import UsersPage from "../features/users/pages/UsersPage";
import AdminLayout from "../features/admin/components/AdminLayout";
import AdminMonitoringPage from "../features/admin/pages/AdminMonitoringPage";
import AdminCategoriesPage from "../features/admin/pages/AdminCategoriesPage";
import AdminUsersPage from "../features/admin/pages/AdminUsersPage";
import MisTicketsPage from "@/features/users/pages/MisTicketsPage";
import PerfilPage from "@/features/users/pages/PerfilPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";


function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-surface px-4 text-center">
      <h1 className="font-display font-extrabold text-4xl">404</h1>
      <p className="text-sm text-on-surface-variant">Página no encontrada</p>
      <a
        href="/"
        className="mt-2 px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg"
      >
        Volver al catálogo
      </a>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
     <Route element={<MainLayout />}>
          {/* Catálogo */}
          <Route path="/" element={<CatalogPage />} />

          {/* Detalle del evento */}
          <Route path="/event/:id" element={<EventDetailPage />} />

          {/* Flujo de Compra Checkout*/}
          <Route path="/checkout" element={<CheckoutPage/>} />

          {/* Autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* Usuario autenticado */}
          <Route path="/mis-tickets" element={<MisTicketsPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>

       {/* Administración */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="monitoreo" replace />} />
        <Route path="monitoreo" element={<AdminMonitoringPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
      </Route>

      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/categories" element={<CategoriesPage />} />
      <Route path="/usuarios-roles-categorias" element={<Navigate to="/admin/users" replace />} />
      <Route path="/usuarios-categorias" element={<Navigate to="/admin/users" replace />} />

       {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
