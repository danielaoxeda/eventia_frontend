import { Plus } from "lucide-react";

interface CategoriesHeaderProps {
  onNuevaCategoria: () => void;
}

export default function CategoriesHeader({ onNuevaCategoria }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
      <div>
        <h1 className="font-display font-black text-2xl lg:text-3xl text-on-surface tracking-tight">
          Gestión de Categorías
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 max-w-2xl">
          Registrar y editar las categorías de eventos disponibles en el sistema con sincronización de estado y trazabilidad horaria.
        </p>
      </div>

      <button
        type="button"
        onClick={onNuevaCategoria}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity shrink-0 self-start shadow-xs"
      >
        <Plus className="w-4 h-4" />
        <span>Nueva Categoría</span>
      </button>
    </div>
  );
}
