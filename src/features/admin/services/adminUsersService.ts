import api from "@/shared/services/api";
import type {
  AdminUser,
  CreateUserFormData,
  PageParams,
  PageResponse,
  UserFilters,
  UserFormData,
} from "../types/admin.types";

function trimProfile(data: UserFormData): UserFormData {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    dni: data.dni.trim(),
    email: data.email.trim(),
    cellphone: data.cellphone.trim(),
  };
}

export const adminUsersService = {
  // Obtiene el listado paginado de organizadores
  async getUsers(params: PageParams<UserFilters>): Promise<PageResponse<AdminUser>> {
    const { data } = await api.get<PageResponse<AdminUser>>("/api/admin/users", {
      params: {
        page: params.page,
        size: params.size,
        search: params.search?.trim() || undefined,
        active: params.active,
      },
    });
    return data;
  },

  // Registra un nuevo organizador con contraseña provisional
  async createUser(formData: CreateUserFormData): Promise<AdminUser> {
    const payload: CreateUserFormData = {
      ...trimProfile(formData),
      password: formData.password,
    };
    const { data } = await api.post<AdminUser>("/api/admin/users", payload);
    return data;
  },

  // Actualiza los datos personales de un organizador
  async updateUser(id: number, formData: UserFormData): Promise<AdminUser> {
    const { data } = await api.put<AdminUser>(
      `/api/admin/users/${id}`,
      trimProfile(formData)
    );
    return data;
  },

  // Activa o desactiva la cuenta de un organizador
  async toggleUserStatus(id: number, active: boolean): Promise<AdminUser> {
    const { data } = await api.patch<AdminUser>(`/api/admin/users/${id}/status`, {
      active,
    });
    return data;
  },
};
