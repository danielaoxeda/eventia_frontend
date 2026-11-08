import { useEffect, useState } from "react";
import CategoriesHeader from "../components/CategoriesHeader";
import CategoriesTable, { type StatusFilter } from "../components/CategoriesTable";
import CategoryModal from "../components/CategoryModal";
import { adminCategoriesService } from "../services/adminCategoriesService";
import type { AdminCategory, CategoryFormData, PageResponse } from "../types/admin.types";
import { getErrorMessage } from "../utils/apiAdapter";

const PAGE_SIZE = 8;

const EMPTY_PAGE: PageResponse<AdminCategory> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: PAGE_SIZE,
  number: 0,
  first: true,
  last: true,
};

/**
 * Página principal de Gestión de Categorías de Eventos.
 * Lista (paginado, base 0), filtra, da de alta y edita categorías a través del service.
 */
export default function AdminCategoriesPage() {
  const [pageData, setPageData] = useState<PageResponse<AdminCategory>>(EMPTY_PAGE);
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todas");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<AdminCategory | null>(null);

  // Carga del listado cada vez que cambian página, filtros o se fuerza una recarga
  useEffect(() => {
    let cancelled = false;
    adminCategoriesService
      .getCategories({
        page: pageIndex,
        size: PAGE_SIZE,
        search,
        active: statusFilter === "Todas" ? undefined : statusFilter === "Activa",
      })
      .then((result) => {
        if (cancelled) return;
        setPageData(result);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(getErrorMessage(e));
      });
    return () => {
      cancelled = true;
    };
  }, [pageIndex, search, statusFilter, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageIndex(0);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setPageIndex(0);
  };

  // Prepara el modal para registrar una nueva taxonomía
  const handleNuevaCategoria = () => {
    setCategoryToEdit(null);
    setModalOpen(true);
  };

  // Abre el modal cargando la información de la categoría seleccionada
  const handleEdit = (category: AdminCategory) => {
    setCategoryToEdit(category);
    setModalOpen(true);
  };

  // Guarda una nueva categoría o actualiza la existente. Si falla, el error llega al modal.
  const handleSave = async (formData: CategoryFormData) => {
    if (categoryToEdit) {
      await adminCategoriesService.updateCategory(categoryToEdit.id, formData);
    } else {
      await adminCategoriesService.createCategory(formData);
      setPageIndex(0);
    }
    setModalOpen(false);
    reload();
  };

  // Alterna el estado activo/inactivo de la categoría
  const handleToggleStatus = async (category: AdminCategory) => {
    try {
      await adminCategoriesService.toggleCategoryStatus(category.id, !category.active);
      reload();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Cabecera con botón de acción */}
      <CategoriesHeader onNuevaCategoria={handleNuevaCategoria} />

      {error && (
        <div className="p-3 text-xs rounded-xl bg-error-container/30 border border-error-container text-error font-medium">
          {error}
        </div>
      )}

      {/* Catálogo con filtros y botones de acción rápida */}
      <CategoriesTable
        page={pageData}
        search={search}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onPageChange={setPageIndex}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal interactivo de creación y modificación */}
      <CategoryModal
        key={`${categoryToEdit?.id ?? "new"}-${modalOpen}`}
        open={modalOpen}
        categoryToEdit={categoryToEdit}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
