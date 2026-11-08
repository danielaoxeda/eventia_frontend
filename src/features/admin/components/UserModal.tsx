import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ShieldCheck, X } from "lucide-react";
import type { AdminUser, CreateUserFormData, UserFormData } from "../types/admin.types";
import { getErrorMessage } from "../utils/apiAdapter";

interface UserModalProps {
  open: boolean;
  userToEdit: AdminUser | null;
  onClose: () => void;
  onSave: (form: UserFormData | CreateUserFormData) => Promise<void> | void;
}

interface UserFormState extends UserFormData {
  password: string;
  confirmPassword: string;
}

// El rol ORGANIZER se asigna automáticamente en el servicio; el formulario no lo gestiona
const EMPTY_FORM: UserFormState = {
  firstName: "",
  lastName: "",
  email: "",
  dni: "",
  cellphone: "",
  password: "",
  confirmPassword: "",
};

const MIN_PASSWORD_LENGTH = 8;

export default function UserModal({
  open,
  userToEdit,
  onClose,
  onSave,
}: UserModalProps) {
  // El estado se inicializa desde el usuario a editar; la página remonta el modal (key) al abrirlo
  const [form, setForm] = useState<UserFormState>(
    userToEdit
      ? {
          firstName: userToEdit.firstName,
          lastName: userToEdit.lastName,
          email: userToEdit.email,
          dni: userToEdit.dni,
          cellphone: userToEdit.cellphone ?? "",
          password: "",
          confirmPassword: "",
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Listener para cerrar el modal al pulsar la tecla Escape
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

  // Manejador de inputs con filtrado numérico para DNI (8 dígitos) y Teléfono (9 dígitos)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "dni") {
      const numeric = value.replace(/\D/g, "").slice(0, 8);
      setForm((prev) => ({ ...prev, dni: numeric }));
      if (error) setError("");
      return;
    }
    if (name === "cellphone") {
      const numeric = value.replace(/\D/g, "").slice(0, 9);
      setForm((prev) => ({ ...prev, cellphone: numeric }));
      if (error) setError("");
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Delega el guardado y muestra el error devuelto por el servidor sin cerrar el modal
  const submit = async (data: UserFormData | CreateUserFormData) => {
    setSubmitting(true);
    try {
      await onSave(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  // Envía el formulario: en altas exige contraseña provisional con confirmación
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.dni.length !== 8) {
      setError("El DNI debe tener exactamente 8 dígitos.");
      return;
    }
    if (form.cellphone.length !== 9) {
      setError("El teléfono debe tener exactamente 9 dígitos.");
      return;
    }

    const profile: UserFormData = {
      firstName: form.firstName,
      lastName: form.lastName,
      dni: form.dni,
      email: form.email,
      cellphone: form.cellphone,
    };

    if (isEditing) {
      setError("");
      await submit(profile);
      return;
    }

    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña provisional debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("La contraseña y su confirmación no coinciden.");
      return;
    }
    setError("");
    await submit({ ...profile, password: form.password });
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
          {/* Mensaje de error de validación */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Nombres
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder="Ej. Mario"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Apellidos
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder="Ej. Vargas Llosa"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
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

          {/* DNI y Teléfono con solo números */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                DNI
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                required
                maxLength={8}
                placeholder="72910482"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                Teléfono
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="cellphone"
                value={form.cellphone}
                onChange={handleChange}
                required
                maxLength={9}
                placeholder="984219042"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all font-mono"
              />
            </div>
          </div>

          {/* Rol asignado */}
          <div className="bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface">Rol asignado</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-on-primary shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              Organizador
            </span>
          </div>

          {/* Contraseña provisional y confirmación (solo en altas) */}
          {!isEditing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Contraseña provisional
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                El organizador usará su correo y esta clave provisional para ingresar a su cuenta.
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-xs disabled:opacity-50"
            >
              {isEditing ? "Guardar cambios" : "Registrar Organizador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
