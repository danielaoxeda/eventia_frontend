import api from "../../../shared/services/api";
import type {
  AdminCategory,
  CategoryFilters,
  CategoryFormData,
  PageParams,
  PageResponse,
} from "../types/admin.types";

const ENDPOINT = "/api/v1/admin/categories";

function trimForm(data: CategoryFormData): CategoryFormData {
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    active: data.active,
  };
}

/**
 * Servicio de categorías para el panel de administración (Spring Boot).
 * Los campos de auditoría (id, createdAt, updatedAt) los gestiona el backend.
 */
export const adminCategoriesService = {
  /** Listado paginado (page base 0) con filtros opcionales `search` y `active`. */
  async getCategories(params: PageParams<CategoryFilters>): Promise<PageResponse<AdminCategory>> {
    const response = await api.get<PageResponse<AdminCategory>>(ENDPOINT, {
      params: {
        page: params.page,
        size: params.size,
        search: params.search?.trim() || undefined,
        active: params.active,
      },
    });
    return response.data;
  },

  async createCategory(data: CategoryFormData): Promise<AdminCategory> {
    const response = await api.post<AdminCategory>(ENDPOINT, trimForm(data));
    return response.data;
  },

  async updateCategory(id: number, data: CategoryFormData): Promise<AdminCategory> {
    const response = await api.put<AdminCategory>(`${ENDPOINT}/${id}`, trimForm(data));
    return response.data;
  },

  async toggleCategoryStatus(id: number, active: boolean): Promise<AdminCategory> {
    const response = await api.patch<AdminCategory>(`${ENDPOINT}/${id}/status`, { active });
    return response.data;
  },
};
