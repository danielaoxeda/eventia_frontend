import { useState, type FormEvent } from "react";
import type { StoredUser } from "@/shared/services/mockUserStorage";
import { Mail, Key, Eye, EyeOff, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface UpdateAccountFormProps {
  user: StoredUser;
  onUpdate: (updates: { email?: string; password?: string }) => void;
}

export default function UpdateAccountForm({ user, onUpdate }: UpdateAccountFormProps) {
  const [email, setEmail] = useState(user.email || "");
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();

    // Validar correo
    if (!trimmedEmail) {
      setError("El correo electrónico no puede estar vacío.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Ingresa un formato de correo electrónico válido (ejemplo@dominio.com).");
      return;
    }

    // Validar contraseña si se seleccionó cambiar
    if (changePassword) {
      if (!currentPassword) {
        setError("Ingresa tu contraseña actual para autorizar el cambio.");
        return;
      }

      if (currentPassword !== user.password) {
        setError("La contraseña actual es incorrecta.");
        return;
      }

      if (!newPassword) {
        setError("Ingresa tu nueva contraseña.");
        return;
      }

      if (newPassword.length < 6) {
        setError("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("La nueva contraseña y la confirmación no coinciden.");
        return;
      }
    }

    // Verificar si realmente cambió algo
    const emailChanged = trimmedEmail.toLowerCase() !== user.email.toLowerCase();
    const passwordChanged = changePassword && newPassword.length > 0;

    if (!emailChanged && !passwordChanged) {
      setError("No has realizado cambios en tu correo o contraseña.");
      return;
    }

    try {
      setIsLoading(true);
      
      const updates: { email?: string; password?: string } = {};
      if (emailChanged) updates.email = trimmedEmail;
      if (passwordChanged) updates.password = newPassword;

      await onUpdate(updates);

      setSuccessMessage("¡Tus datos de cuenta han sido actualizados exitosamente!");
      
      // Limpiar campos de contraseña tras éxito
      if (passwordChanged) {
        setChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      if (err?.message === "EMAIL_IN_USE") {
        setError("Este correo electrónico ya está registrado por otro usuario.");
      } else {
        setError("Ocurrió un error al actualizar los datos. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Encabezado de Sección */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Actualizar Credenciales</h3>
            <p className="text-xs text-slate-500">Puedes modificar tu correo electrónico o contraseña de acceso</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-xs font-semibold text-emerald-700 border border-emerald-200/80">
          Editable
        </span>
      </div>

      {/* Alerta de Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Alerta de Éxito */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Campo Correo Electrónico */}
        <div>
          <label htmlFor="user-email-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="user-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Este correo será tu identificador para iniciar sesión y recibir comprobantes.
          </p>
        </div>

        {/* Separador y Checkbox Cambiar Contraseña */}
        <div className="pt-2 border-t border-slate-100">
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Key className="h-4 w-4 text-indigo-600" />
              ¿Deseas cambiar tu contraseña?
            </span>
          </label>
        </div>

        {/* Campos de Contraseña (Condicional) */}
        {changePassword && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 sm:p-5 space-y-4 animate-fadeIn">
            
            {/* Contraseña Actual */}
            <div>
              <label htmlFor="current-pass-input" className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  id="current-pass-input"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Nueva Contraseña */}
              <div>
                <label htmlFor="new-pass-input" className="block text-xs font-bold text-slate-700 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    id="new-pass-input"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div>
                <label htmlFor="confirm-pass-input" className="block text-xs font-bold text-slate-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm-pass-input"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Botón de envío */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 transition"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>

      </form>
    </div>
  );
}
