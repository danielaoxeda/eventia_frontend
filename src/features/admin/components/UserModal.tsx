import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ShieldCheck, X } from "lucide-react";
import type { AdminUser, UserFormData } from "../types/admin.types";

interface UserModalProps {
  open: boolean;
  userToEdit: AdminUser | null;
  onClose: () => void;
  onSave: (form: UserFormData) => void;
}

const EMPTY_FORM: UserFormData = {
  nombre: "",
  email: "",
  dni: "",
  telefono: "",
  rol: "Organizador", // Rol predeterminado para altas desde el panel administrativo
};

export default function UserModal({
  open,
  userToEdit,
  onClose,
  onSave,
}: UserModalProps) {
  const [form, setForm] = useState<UserFormData>(EMPTY_FORM);

  // Hook 1: Sincroniza los campos cuando se abre el modal o cambia el usuario a editar
  useEffect(() => {
    if (userToEdit) {
      setForm({
        nombre: userToEdit.nombre,
        email: userToEdit.email,
        dni: userToEdit.dni,
        telefono: userToEdit.telefono,
        rol: userToEdit.rol,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [userToEdit, open]);

  // Hook 2: Listener para cerrar el modal al pulsar la tecla Escape
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

  const isEditing = Boolean(userToEdit);

  // Manejador genérico para inputs de texto
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Envía el formulario forzando rol 'Organizador' en altas
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      rol: isEditing ? form.rol : "Organizador",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Fondo oscuro translúcido */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Tarjeta del Modal */}
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-lg text-on-surface">
              {isEditing ? "Editar Usuario" : "Nuevo Organizador"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isEditing
                ? "Modifica los datos del usuario seleccionado."
                : "Ingresa los datos para registrar al nuevo organizador."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Nombre completo o Razón Social
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Ej. Live Producciones SAC"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Correo electrónico */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="contacto@organizacion.pe"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* DNI / RUC y Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                DNI / RUC
              </label>
              <input
                type="text"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                required
                placeholder="20601948231"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Teléfono
              </label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
                placeholder="+51 999 999 999"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Rol asignado */}
          <div className="bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface">Rol asignado</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-on-primary shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isEditing ? form.rol : "Organizador"}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-xs"
            >
              {isEditing ? "Guardar cambios" : "Registrar Organizador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
