import type { StoredUser } from "@/shared/services/mockUserStorage";
import {  Mail, IdCard } from "lucide-react";

interface ProfileHeaderProps {
  user: StoredUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  // Generar iniciales del usuario
  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "US";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      {/* Fondo decorativo sutil */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-50/50 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        
        {/* Avatar e Identidad */}
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-2xl font-black text-white shadow-md shadow-indigo-100">
            {initials}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {user.firstName} {user.lastName}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cuenta Activa
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <Mail className="h-4 w-4 text-indigo-500" />
                {user.email}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <IdCard className="h-4 w-4 text-indigo-500" />
                {user.documentType || "DNI"}: {user.documentNumber || "No registrado"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
