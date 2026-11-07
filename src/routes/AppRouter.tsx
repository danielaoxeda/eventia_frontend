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

import ScrollToTop from "@/shared/components/ScrollToTop";

import OrganizerLayout from "../features/organizer/components/layout/OrganizerLayout";
import OrganizerDashboardPage from "../features/organizer/pages/OrganizerDashboardPage";
import EventEditPage from "../features/organizer/pages/EventEditPage";
import EventCreatePage from "../features/organizer/pages/EventCreatePage";
import EventTicketsPage from "../features/organizer/pages/EventTicketsPage";
import QrValidatorPage from "../features/organizer/pages/QrValidatorPage";
import { RequireAuth, RequireRole, RedirectIfAuth } from "./RequireAuth";
import ForbiddenPage from "./ForbiddenPage";

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
    <>
    <ScrollToTop />
    <Routes>
      {/* 1. Flujo Público y Cliente */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/registro"
          element={
            <RedirectIfAuth>
              <RegisterPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/mis-tickets"
          element={
            <RequireAuth>
              <MisTicketsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <PerfilPage />
            </RequireAuth>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
      </Route>

      {/* 2. Módulo de Administración (solo ADMIN) */}
      <Route
        path="/admin"
        element={
          <RequireRole rol="ADMIN">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="monitoreo" replace />} />
        <Route path="monitoreo" element={<AdminMonitoringPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
      </Route>

      <Route
        path="/admin/users"
        element={
          <RequireRole rol="ADMIN">
            <UsersPage />
          </RequireRole>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <RequireRole rol="ADMIN">
            <CategoriesPage />
          </RequireRole>
        }
      />
      <Route path="/usuarios-roles-categorias" element={<Navigate to="/admin/users" replace />} />
      <Route path="/usuarios-categorias" element={<Navigate to="/admin/users" replace />} />

      {/* 3. Módulo del Organizador (solo ORGANIZER) */}
      <Route
        path="/organizador"
        element={
          <RequireRole rol="ORGANIZER">
            <OrganizerLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OrganizerDashboardPage />} />
        <Route path="eventos/nuevo" element={<EventCreatePage />} />
        <Route path="eventos/:id/editar" element={<EventEditPage />} />
        <Route path="eventos/:id/entradas" element={<EventTicketsPage />} />
        <Route path="eventos/entradas" element={<EventTicketsPage />} />
        <Route path="validar-qr" element={<QrValidatorPage />} />
      </Route>

      {/* 403: sesión con rol insuficiente */}
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}
