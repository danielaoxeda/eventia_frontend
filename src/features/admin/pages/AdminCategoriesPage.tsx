import { useEffect, useState } from "react";
import CategoriesHeader from "../components/CategoriesHeader";
import CategoriesTable from "../components/CategoriesTable";
import CategoryModal from "../components/CategoryModal";
import { adminCategoriesService } from "../services/adminCategoriesService";
import type { AdminCategory, CategoryFormData } from "../types/admin.types";

/**
 * Página principal de Gestión de Categorías de Eventos.
 * Permite listar, filtrar, dar de alta y editar taxonomías con sincronización
 * hacia la API dummy (json-server db.json).
 */
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<AdminCategory | null>(null);

  // Carga inicial del catálogo desde la API dummy
  useEffect(() => {
    adminCategoriesService.getCategories().then(setCategories);
  }, []);

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

  // Guarda una nueva categoría o actualiza la existente
  const handleSave = async (formData: CategoryFormData) => {
    if (categoryToEdit) {
      const actualizada = await adminCategoriesService.updateCategory(
        categoryToEdit.id,
        formData
      );
      setCategories((prev) =>
        prev.map((c) => (c.id === actualizada.id ? actualizada : c))
      );
    } else {
      const nueva = await adminCategoriesService.createCategory(formData);
      setCategories((prev) => [nueva, ...prev]);
    }
    setModalOpen(false);
  };

  // Alterna visibilidad pública (Activa <-> Inactiva)
  const handleToggleStatus = async (category: AdminCategory) => {
    const nuevoEstado = category.estado === "Activa" ? "Inactiva" : "Activa";
    const actualizada = await adminCategoriesService.toggleCategoryStatus(
      category.id,
      nuevoEstado
    );
    setCategories((prev) =>
      prev.map((c) => (c.id === actualizada.id ? actualizada : c))
    );
  };

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Cabecera con botón de acción */}
      <CategoriesHeader onNuevaCategoria={handleNuevaCategoria} />

      {/* Catálogo con filtros y botones de acción rápida */}
      <CategoriesTable
        categories={categories}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal interactivo de creación y modificación */}
      <CategoryModal
        open={modalOpen}
        categoryToEdit={categoryToEdit}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
