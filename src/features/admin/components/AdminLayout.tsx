import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Barra lateral de administración */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Contenedor principal con offset para el sidebar en desktop */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <AdminTopbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 px-4 sm:px-8 py-6 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
