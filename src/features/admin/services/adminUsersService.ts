import api from "../../../shared/services/api";
import { saveOrganizerFromAdmin } from "../../../shared/services/mockUserStorage";
import type { AdminUser, UserFormData } from "../types/admin.types";

/**
 * Datos semilla locales en memoria como respaldo (fallback)
 * si el servidor json-server (db.json) se encuentra apagado.
 */
let mockUsersMemory: AdminUser[] = [
  {
    id: "1",
    codigo: "#1082",
    nombre: "Mario Vargas Llosa",
    email: "contacto@marioeventos.pe",
    iniciales: "MV",
    dni: "20601948",
    telefono: "+51 984 219 042",
    rol: "Organizador",
    fechaRegistro: "14/01/2024",
    estado: "Activo",
  },
  {
    id: "2",
    codigo: "#2491",
    nombre: "Camila Paredes Ramos",
    email: "camila.paredes@gmail.com",
    iniciales: "CP",
    dni: "72910482",
    telefono: "+51 951 847 302",
    rol: "Cliente",
    fechaRegistro: "02/02/2024",
    estado: "Activo",
  },
  {
    id: "3",
    codigo: "#1184",
    nombre: "Live Producciones SAC",
    email: "operaciones@liveprod.pe",
    iniciales: "LP",
    dni: "20548194",
    telefono: "+51 998 776 210",
    rol: "Organizador",
    fechaRegistro: "19/03/2024",
    estado: "Inactivo",
  },
  {
    id: "4",
    codigo: "#3188",
    nombre: "Jorge Torres Mendoza",
    email: "jorge.torres@outlook.com",
    iniciales: "JT",
    dni: "45892019",
    telefono: "+51 940 332 104",
    rol: "Cliente",
    fechaRegistro: "27/04/2024",
    estado: "Activo",
  },
  {
    id: "5",
    codigo: "#3298",
    nombre: "Daniela Aguirre Salcedo",
    email: "dani.aguirre@pucp.edu.pe",
    iniciales: "DA",
    dni: "70184920",
    telefono: "+51 977 120 449",
    rol: "Cliente",
    fechaRegistro: "10/05/2024",
    estado: "Inactivo",
  },
  {
    id: "6",
    codigo: "#1145",
    nombre: "Eventos Teatro Municipal",
    email: "administracion@teatromunicipal.pe",
    iniciales: "ET",
    dni: "20100084",
    telefono: "+51 992 405 119",
    rol: "Organizador",
    fechaRegistro: "18/06/2024",
    estado: "Activo",
  },
  {
    id: "7",
    codigo: "#3412",
    nombre: "Rodrigo Benavides Vega",
    email: "rbenavides@gmail.com",
    iniciales: "RB",
    dni: "47828194",
    telefono: "+51 981 445 092",
    rol: "Cliente",
    fechaRegistro: "03/07/2024",
    estado: "Activo",
  },
];

/**
 * Servicio encargado de la comunicación con la API dummy (json-server / db.json)
 * para la gestión de usuarios y alta de organizadores.
 */
export const adminUsersService = {
  /**
   * Obtiene la lista completa de usuarios registrados.
   * Conecta con GET /admin_users del json-server.
   */
  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await api.get<AdminUser[]>("/admin_users");
      if (Array.isArray(response.data) && response.data.length > 0) {
        mockUsersMemory = response.data;
        return response.data;
      }
      return mockUsersMemory;
    } catch {
      // Si la API dummy está offline, retorna la memoria local sin interrumpir la UI
      return mockUsersMemory;
    }
  },

  /**
   * Alterna el estado de una cuenta (Activo <-> Inactivo).
   * Conecta con PATCH /admin_users/:id en el json-server.
   */
  async toggleUserStatus(id: string, nuevoEstado: "Activo" | "Inactivo"): Promise<AdminUser> {
    try {
      const response = await api.patch<AdminUser>(`/admin_users/${id}`, {
        estado: nuevoEstado,
      });
      mockUsersMemory = mockUsersMemory.map((u) => (u.id === id ? response.data : u));
      return response.data;
    } catch {
      // Fallback local
      const user = mockUsersMemory.find((u) => u.id === id);
      if (!user) throw new Error("Usuario no encontrado");
      user.estado = nuevoEstado;
      return { ...user };
    }
  },

  /**
   * Registra un nuevo Organizador de eventos.
   * Conecta con POST /admin_users en el json-server.
   */
  async createUser(form: UserFormData): Promise<AdminUser> {
    const provisionalPassword = form.password || `Org${form.dni.trim()}!`;

    const nuevoUsuario: AdminUser = {
      id: String(Date.now()),
      codigo: `#${Math.floor(Math.random() * 9000) + 1000}`,
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      dni: form.dni.trim(),
      telefono: form.telefono.trim(),
      rol: "Organizador",
      password: provisionalPassword,
      iniciales: form.nombre
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
      fechaRegistro: new Date().toLocaleDateString("es-PE"),
      estado: "Activo",
    };

    // Sincroniza las credenciales en la autenticación local para permitir el login inmediato
    saveOrganizerFromAdmin({
      nombre: form.nombre,
      email: form.email,
      dni: form.dni,
      telefono: form.telefono,
      password: provisionalPassword,
    });

    try {
      const response = await api.post<AdminUser>("/admin_users", nuevoUsuario);
      mockUsersMemory = [response.data, ...mockUsersMemory];
      return response.data;
    } catch {
      // Fallback local
      mockUsersMemory = [nuevoUsuario, ...mockUsersMemory];
      return nuevoUsuario;
    }
  },

  /**
   * Actualiza los datos de un usuario existente.
   * Conecta con PATCH /admin_users/:id en el json-server.
   */
  async updateUser(id: string, form: UserFormData): Promise<AdminUser> {
    const payload = {
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      dni: form.dni.trim(),
      telefono: form.telefono.trim(),
      iniciales: form.nombre
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
    };

    try {
      const response = await api.patch<AdminUser>(`/admin_users/${id}`, payload);
      mockUsersMemory = mockUsersMemory.map((u) => (u.id === id ? response.data : u));
      return response.data;
    } catch {
      // Fallback local
      const idx = mockUsersMemory.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error("Usuario no encontrado");
      mockUsersMemory[idx] = { ...mockUsersMemory[idx], ...payload };
      return { ...mockUsersMemory[idx] };
    }
  },
};
