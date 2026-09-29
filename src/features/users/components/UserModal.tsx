import { useState } from "react";
import { USER_ROLES } from "../services/users.service";
import type { NewDirectoryUser, Role } from "../types/user.types";
import { isPromoUser } from "../../events/services/events.service";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: NewDirectoryUser) => void;
}

/**
 * Modal controlado de alta. Si el nombre califica (Roberto/Gerónimo),
 * avisa que tendrá la promo del 15%.
 */
export default function UserModal({ open, onClose, onSubmit }: UserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Cliente");
  const [docType, setDocType] = useState("DNI (persona natural)");
  const [docNumber, setDocNumber] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, role });
    setName("");
    setEmail("");
    setRole("Cliente");
    setDocType("DNI (persona natural)");
    setDocNumber("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-xl overflow-hidden my-8">
        <div className="px-4 py-4 bg-surface-container flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[22px] shrink-0">person_add</span>
            <h3 className="font-display font-semibold text-lg truncate">Crear / Invitar Usuario</h3>
          </div>
          <button onClick={onClose} type="button" aria-label="Cerrar" className="p-1 rounded-lg hover:bg-surface-variant shrink-0">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase min-w-0">
              Nombres y apellidos *
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Roberto Quispe"
                type="text"
                autoComplete="name"
                className="px-3 py-2 rounded-lg bg-surface-container font-normal normal-case focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase min-w-0">
              Correo electrónico *
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="roberto@empresa.pe"
                type="email"
                autoComplete="email"
                className="px-3 py-2 rounded-lg bg-surface-container font-normal normal-case focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase min-w-0">
              Rol *
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="px-3 py-2 rounded-lg bg-surface-container font-normal normal-case focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
              >
                {USER_ROLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase min-w-0">
              Tipo de documento *
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="px-3 py-2 rounded-lg bg-surface-container font-normal normal-case focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
              >
                <option>DNI (persona natural)</option>
                <option>RUC 20 (persona jurídica)</option>
                <option>Carné de extranjería (CE)</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1.5 text-[11px] font-bold uppercase min-w-0">
            Número de documento *
            <input
              required
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="8 dígitos DNI o 11 RUC"
              type="text"
              inputMode="numeric"
              className="px-3 py-2 rounded-lg bg-surface-container font-normal normal-case focus:outline-none focus:ring-2 focus:ring-primary min-w-0"
            />
          </label>
          {isPromoUser(name) && (
            <div className="p-3 rounded-lg bg-secondary-fixed/40 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">percent</span>
              <span>Este usuario tendrá 15% de descuento promo por llamarse Roberto o Gerónimo.</span>
            </div>
          )}
          <div className="p-3 rounded-lg bg-surface-container text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0">info</span>
            <span>Se enviará un correo con enlace seguro para configurar la contraseña.</span>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-surface-container text-sm hover:bg-surface-container-high">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-bold hover:opacity-90">Emitir invitación</button>
          </div>
        </form>
      </div>
    </div>
  );
}
