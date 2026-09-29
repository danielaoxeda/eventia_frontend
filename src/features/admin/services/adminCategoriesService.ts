import api from "../../../shared/services/api";
import type { AdminCategory, CategoryFormData, CategoryStatus } from "../types/admin.types";

/**
 * Genera una estampa de tiempo formateada YYYY-MM-DD HH:mm:ss
 */
function getFormattedDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Datos semilla locales en memoria como respaldo (fallback)
 * si el servidor json-server (db.json) se encuentra apagado.
 */
let categoriesMemory: AdminCategory[] = [
  {
    id: "cat-1",
    numeroId: 1,
    nombre: "Conciertos & Festivales",
    descripcion: "Presentaciones musicales masivas en vivo, festivales y recitales.",
    estado: "Activa",
    ultimaActualizacion: "2024-04-10 11:22:15",
  },
  {
    id: "cat-2",
    numeroId: 2,
    nombre: "Teatro & Artes Escénicas",
    descripcion: "Obras teatrales, comedia en vivo, danza contemporánea y ballet.",
    estado: "Activa",
    ultimaActualizacion: "2024-04-12 16:45:00",
  },
  {
    id: "cat-3",
    numeroId: 3,
    nombre: "Conferencias & Tech",
    descripcion: "Cumbres de tecnología, foros empresariales, congresos y networking.",
    estado: "Activa",
    ultimaActualizacion: "2024-04-14 09:10:30",
  },
  {
    id: "cat-4",
    numeroId: 4,
    nombre: "Deportes & Maratones",
    descripcion: "Competiciones deportivas oficiales, maratones, torneos y exhibiciones.",
    estado: "Activa",
    ultimaActualizacion: "2024-04-15 13:05:40",
  },
  {
    id: "cat-5",
    numeroId: 5,
    nombre: "Gastronomía & Ferias",
    descripcion: "Festivales culinarios representativos, catas de vino y ferias gastronómicas.",
    estado: "Inactiva",
    ultimaActualizacion: "2024-04-16 10:00:00",
  },
  {
    id: "cat-6",
    numeroId: 6,
    nombre: "Cine & Entretenimiento",
    descripcion: "Festivales de cortometrajes independientes, proyecciones y alfombras rojas.",
    estado: "Activa",
    ultimaActualizacion: "2024-04-16 14:15:10",
  },
];

/**
 * Servicio encargado de la comunicación con la API dummy (json-server / db.json)
 * para el catálogo de taxonomías y categorías de eventos.
 */
export const adminCategoriesService = {
  /**
   * Obtiene la lista completa de categorías desde GET /admin_categories
   */
  async getCategories(): Promise<AdminCategory[]> {
    try {
      const response = await api.get<AdminCategory[]>("/admin_categories");
      if (Array.isArray(response.data) && response.data.length > 0) {
        categoriesMemory = response.data;
        return response.data;
      }
      return categoriesMemory;
    } catch {
      return categoriesMemory;
    }
  },

  /**
   * Registra una nueva categoría en POST /admin_categories
   */
  async createCategory(formData: CategoryFormData): Promise<AdminCategory> {
    const nextNum =
      categoriesMemory.length > 0
        ? Math.max(...categoriesMemory.map((c) => c.numeroId)) + 1
        : 1;

    const nueva: AdminCategory = {
      id: `cat-${Date.now()}`,
      numeroId: nextNum,
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      estado: formData.estado,
      ultimaActualizacion: getFormattedDateTime(),
    };

    try {
      const response = await api.post<AdminCategory>("/admin_categories", nueva);
      categoriesMemory = [response.data, ...categoriesMemory];
      return response.data;
    } catch {
      categoriesMemory = [nueva, ...categoriesMemory];
      return nueva;
    }
  },

  /**
   * Actualiza el nombre, descripción y estado de una categoría en PATCH /admin_categories/:id
   */
  async updateCategory(id: string, formData: CategoryFormData): Promise<AdminCategory> {
    const payload = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      estado: formData.estado,
      ultimaActualizacion: getFormattedDateTime(),
    };

    try {
      const response = await api.patch<AdminCategory>(`/admin_categories/${id}`, payload);
      categoriesMemory = categoriesMemory.map((c) => (c.id === id ? response.data : c));
      return response.data;
    } catch {
      const index = categoriesMemory.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Categoría no encontrada");
      categoriesMemory[index] = { ...categoriesMemory[index], ...payload };
      return { ...categoriesMemory[index] };
    }
  },

  /**
   * Alterna el estado de publicación (Activa <-> Inactiva) en PATCH /admin_categories/:id
   */
  async toggleCategoryStatus(id: string, nuevoEstado: CategoryStatus): Promise<AdminCategory> {
    const payload = {
      estado: nuevoEstado,
      ultimaActualizacion: getFormattedDateTime(),
    };

    try {
      const response = await api.patch<AdminCategory>(`/admin_categories/${id}`, payload);
      categoriesMemory = categoriesMemory.map((c) => (c.id === id ? response.data : c));
      return response.data;
    } catch {
      const index = categoriesMemory.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Categoría no encontrada");
      categoriesMemory[index] = { ...categoriesMemory[index], ...payload };
      return { ...categoriesMemory[index] };
    }
  },
};
