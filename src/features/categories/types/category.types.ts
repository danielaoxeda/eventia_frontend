/** Categoría administrable. Solo admite baja lógica (`isActive`). */
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  events: number;
  liveLabel: string;
  volume: string;
  isActive: boolean;
}

/** Datos que pide el modal para crear una categoría. */
export interface NewAdminCategory {
  name: string;
}
