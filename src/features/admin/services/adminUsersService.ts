import api from "../../../shared/services/api";
import type {
  AdminUser,
  CreateUserFormData,
  PageParams,
  PageResponse,
  UserFilters,
  UserFormData,
} from "../types/admin.types";

const ENDPOINT = "/api/v1/admin/users";

function trimProfile(data: UserFormData): UserFormData {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    dni: data.dni.trim(),
    email: data.email.trim(),
    cellphone: data.cellphone.trim(),
  };
}

/**
 * Servicio de organizadores (User con rol ORGANIZER) para el panel de administración.
 * El backend asigna role = ORGANIZER, active = true y gestiona createdAt / updatedAt.
 */
export const adminUsersService = {
  /** Listado paginado (page base 0) exclusivo de organizadores, con filtros `search` y `active`. */
  async getUsers(params: PageParams<UserFilters>): Promise<PageResponse<AdminUser>> {
    const response = await api.get<PageResponse<AdminUser>>(ENDPOINT, {
      params: {
        page: params.page,
        size: params.size,
        search: params.search?.trim() || undefined,
        active: params.active,
      },
    });
    return response.data;
  },

  /** Alta de organizador con contraseña provisional. */
  async createUser(data: CreateUserFormData): Promise<AdminUser> {
    const payload: CreateUserFormData = {
      ...trimProfile(data),
      password: data.password,
    };
    const response = await api.post<AdminUser>(ENDPOINT, payload);
    return response.data;
  },

  /** Actualiza datos personales; no modifica rol ni contraseña. */
  async updateUser(id: number, data: UserFormData): Promise<AdminUser> {
    const response = await api.put<AdminUser>(`${ENDPOINT}/${id}`, trimProfile(data));
    return response.data;
  },

  async toggleUserStatus(id: number, active: boolean): Promise<AdminUser> {
    const response = await api.patch<AdminUser>(`${ENDPOINT}/${id}/status`, { active });
    return response.data;
  },
};
