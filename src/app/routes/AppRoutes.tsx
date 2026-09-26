import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import LoginPage from "../../features/login/pages/LoginPage";

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">
        Catálogo de eventos
      </h1>

      <p className="mt-2 text-slate-600">
        Explora los próximos eventos disponibles en Eventia.
      </p>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">
        Crear cuenta
      </h1>

      <p className="mt-2 text-slate-600">
        Regístrate para comenzar a utilizar Eventia.
      </p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}