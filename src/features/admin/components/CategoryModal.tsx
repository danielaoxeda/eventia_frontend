import { useEffect, useState, type FormEvent } from "react";
import { Save, X } from "lucide-react";
import type { AdminCategory, CategoryFormData, CategoryStatus } from "../types/admin.types";

interface CategoryModalProps {
  open: boolean;
  categoryToEdit: AdminCategory | null;
  onClose: () => void;
  onSave: (data: CategoryFormData) => Promise<void> | void;
}

export default function CategoryModal({
  open,
  categoryToEdit,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<CategoryStatus>("Activa");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setNombre(categoryToEdit.nombre);
      setDescripcion(categoryToEdit.descripcion);
      setEstado(categoryToEdit.estado);
      setError(null);
    } else {
      setNombre("");
      setDescripcion("");
      setEstado("Activa");
      setError(null);
    }
  }, [categoryToEdit, open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isEditing = Boolean(categoryToEdit);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSave({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        estado,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEstado = () => {
    setEstado((prev) => (prev === "Activa" ? "Inactiva" : "Activa"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-primary tracking-wider uppercase block mb-1">
              {isEditing
                ? `Editando Registro #${categoryToEdit?.numeroId}`
                : "Nuevo Registro"}
            </span>
            <h2 className="text-xl font-bold text-on-surface">
              {isEditing ? "Editar Categoría" : "Registrar Categoría"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isEditing
                ? "Actualiza la información visible y taxonomía de la categoría."
                : "Define una nueva clasificación para segmentar los eventos del sistema."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-error-container/30 border border-error-container text-error font-medium">
              {error}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="modal-category-name"
                className="text-xs font-semibold text-on-surface"
              >
                Nombre de la Categoría
              </label>
              <span className="text-xs font-medium text-error">* Requerido</span>
            </div>
            <input
              id="modal-category-name"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Conciertos & Festivales"
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              disabled={submitting}
              autoFocus
            />
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Identificador nominal visible para asistentes y productores.
            </p>
          </div>

          <div>
            <label
              htmlFor="modal-category-description"
              className="block text-xs font-semibold text-on-surface mb-1.5"
            >
              Descripción Funcional
            </label>
            <textarea
              id="modal-category-description"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Define el alcance de eventos cubiertos por este segmento..."
              maxLength={250}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              disabled={submitting}
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Máximo 250 caracteres recomendados para catálogos.</span>
              <span>{descripcion.length}/250</span>
            </div>
          </div>

          <div className="bg-surface-container/30 border border-outline-variant/20 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-on-surface">
                Estado de Publicación
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {estado === "Activa"
                  ? "Visible en plataforma (Activa)"
                  : "Oculto en plataforma (Inactiva)"}
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={estado === "Activa"}
              onClick={handleToggleEstado}
              disabled={submitting}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                estado === "Activa" ? "bg-primary" : "bg-outline-variant/40"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  estado === "Activa" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-on-primary bg-primary hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Actualizar Categoría" : "Guardar Categoría"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
