import type { StoredUser } from "@/shared/services/mockUserStorage";
import { Lock, User, FileText, Phone, Calendar, ShieldAlert } from "lucide-react";

interface ReadOnlyUserInfoProps {
  user: StoredUser;
}

export default function ReadOnlyUserInfo({ user }: ReadOnlyUserInfoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Encabezado de Sección */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Datos Personales</h3>
            <p className="text-xs text-slate-500">Información de identidad registrada en tu cuenta</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200">
          <Lock className="h-3 w-3 text-slate-400" />
          Solo Lectura
        </span>
      </div>

      {/* Aviso informativo de seguridad */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs leading-relaxed">
        <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Datos de identidad protegidos:</span> Por motivos de seguridad nominativa de entradas, tus datos personales no se pueden modificar directamente desde la plataforma.
        </div>
      </div>

      {/* Grid de Campos en Solo Lectura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Nombres */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nombres
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              disabled
              value={user.firstName || "No registrado"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 cursor-not-allowed select-none focus:outline-none"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Apellidos
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              disabled
              value={user.lastName || "No registrado"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 cursor-not-allowed select-none focus:outline-none"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Tipo de Documento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tipo de Documento
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 cursor-not-allowed select-none">
              <FileText className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{user.documentType || "DNI"}</span>
            </div>
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Número de Documento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Número de Documento
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              disabled
              value={user.documentNumber || "48120573"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 cursor-not-allowed select-none focus:outline-none"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Teléfono / Celular
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 cursor-not-allowed select-none">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{user.phoneNumber || "+51 987 654 321"}</span>
            </div>
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Fecha de Nacimiento
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 cursor-not-allowed select-none">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{user.birthDate || "15/05/1992"}</span>
            </div>
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

      </div>
    </div>
  );
}
