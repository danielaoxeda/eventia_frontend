import api from "@/shared/services/api";
import type {
  AdminCategory,
  CategoryFilters,
  CategoryFormData,
  PageParams,
  PageResponse,
} from "../types/admin.types";

function trimForm(data: CategoryFormData): CategoryFormData {
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    active: data.active,
  };
}

export const adminCategoriesService = {
  // Obtiene el listado paginado de categorías con filtros opcionales
  async getCategories(params: PageParams<CategoryFilters>): Promise<PageResponse<AdminCategory>> {
    console.log("[AdminCategories] Consultando categorias");
    const { data } = await api.get<PageResponse<AdminCategory>>("/api/categories/admin", {
      params: {
        page: params.page,
        size: params.size,
        search: params.search?.trim() || undefined,
        active: params.active,
      },
    });
    return data;
  },

  // Registra una nueva categoría
  async createCategory(payload: CategoryFormData): Promise<AdminCategory> {
    console.log("[AdminCategories] Creando categoria:", payload.name.trim());
    const { data } = await api.post<AdminCategory>("/api/categories", trimForm(payload));
    return data;
  },

  // Actualiza los datos de una categoría existente
  async updateCategory(id: number, payload: CategoryFormData): Promise<AdminCategory> {
    console.log("[AdminCategories] Actualizando categoria id:", id);
    const { data } = await api.put<AdminCategory>(`/api/categories/${id}`, trimForm(payload));
    return data;
  },

  // Activa o desactiva una categoría
  async toggleCategoryStatus(id: number, active: boolean): Promise<AdminCategory> {
    console.log("[AdminCategories] Cambiando estado de categoria id:", id, "activo:", active);
    const { data } = await api.patch<AdminCategory>(`/api/categories/${id}/status`, {
      active,
    });
    return data;
  },
};
