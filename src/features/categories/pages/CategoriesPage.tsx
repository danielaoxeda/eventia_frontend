import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "../../../shared/layouts/AdminHeader";
import AdminSidebar from "../../../shared/layouts/AdminSidebar";
import AdminTabs from "../../../shared/layouts/AdminTabs";
import KpiRibbon from "../../../shared/components/KpiRibbon";
import Toast, { type ToastData } from "../../../shared/components/Toast";
import CategoryManager from "../components/CategoryManager";
import CategoryModal from "../components/CategoryModal";
import { INITIAL_CATEGORIES, buildCategory } from "../services/categories.service";
import type { NewAdminCategory } from "../types/category.types";

/**
 * Gestión de categorías con baja lógica: desactivar oculta de cartelera
 * sin borrar historial. Incluye KPIs en vivo y alta con slug automático.
 */
export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const navigate = useNavigate();

  const showToast = (title: string, description: string) => {
    setToast({ title, description });
    window.setTimeout(() => setToast(null), 4000);
  };

  const toggleCategory = (id: string) =>
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, isActive: !category.isActive } : category,
      ),
    );

  const createCategory = (input: NewAdminCategory) => {
    setCategories((prev) => [
      buildCategory(`CAT-${String(prev.length + 1).padStart(2, "0")}`, input),
      ...prev,
    ]);
    setCategoryModalOpen(false);
    showToast("Categoría registrada", `"${input.name.trim()}" visible en cartelera.`);
  };

  const activeCount = categories.filter((category) => category.isActive).length;

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <AdminSidebar />
      <div className="pl-0 lg:pl-64 min-w-0">
        <AdminHeader onNewUser={() => navigate("/admin/users")} />
        <main className="w-full pt-16 px-4 sm:px-6 min-h-screen min-w-0">
          <div className="flex flex-col w-full pb-10 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4 min-w-0">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                    Módulo de administración
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Eventia S.A.C.
                  </span>
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-balance">
                  Gestión de categorías
                </h1>
                <p className="text-[0.9375rem] text-on-surface-variant max-w-2xl wrap-break-word">
                  Taxonomías operativas del catálogo y su estado en cartelera.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  to="/admin/users"
                  className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-variant px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                  <span>Ver usuarios</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary hover:opacity-90 px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                  <span>Nueva categoría</span>
                </button>
              </div>
            </div>

            <AdminTabs />
            <KpiRibbon activeCategories={activeCount} totalCategories={categories.length} />
            <CategoryManager categories={categories} onToggle={toggleCategory} onToast={showToast} />
          </div>
        </main>
      </div>

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={createCategory}
      />
      <Toast toast={toast} />
    </div>
  );
}
