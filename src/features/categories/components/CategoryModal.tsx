import { useState } from "react";
import type { NewAdminCategory } from "../types/category.types";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewAdminCategory) => void;
}

/** Modal controlado de alta de categoría (el slug se genera solo). */
export default function CategoryModal({ open, onClose, onSubmit }: CategoryModalProps) {
  const [name, setName] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
    setName("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden my-8">
        <div className="px-4 py-4 bg-surface-container flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0">bookmark_add</span>
            <h3 className="font-display font-semibold text-lg truncate">Registrar categoría</h3>
          </div>
          <button onClick={onClose} type="button" aria-label="Cerrar" className="p-1 rounded-lg hover:bg-surface-variant shrink-0">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase min-w-0">
            Nombre de la categoría *
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Deportes electrónicos & gaming"
              type="text"
              className="px-3 py-2 rounded-lg bg-surface-container font-normal normal-case focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
            />
          </label>
          <div className="p-3 rounded-lg bg-secondary-fixed/40 text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">gavel</span>
            <span>Quedará protegida: solo baja lógica, nunca borrado definitivo.</span>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-surface-container text-sm hover:bg-surface-container-high">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-bold hover:opacity-90">Guardar categoría</button>
          </div>
        </form>
      </div>
    </div>
  );
}
