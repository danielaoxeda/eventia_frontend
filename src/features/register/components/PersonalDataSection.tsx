import React from "react";
import { Calendar } from "lucide-react";
import type { RegisterRequest } from "../types/register.types";

interface PersonalDataSectionProps {
  form: RegisterRequest;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function PersonalDataSection({
  form,
  onChange,
}: PersonalDataSectionProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-l-4 border-rose-600 pl-3 py-0.5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          DATOS PERSONALES
        </h2>

        <span className="text-xs font-semibold text-rose-500">
          * Campos obligatorios
        </span>
      </div>

      {/* Nombres y apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Nombres Completos <span className="text-rose-500">*</span>
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={form.firstName}
            onChange={onChange}
            placeholder="Carlos Eduardo"
            className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Apellidos Completos <span className="text-rose-500">*</span>
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={form.lastName}
            onChange={onChange}
            placeholder="Mendoza Salazar"
            className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Documento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="documentType"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Tipo de Documento <span className="text-rose-500">*</span>
          </label>

          <select
            id="documentType"
            name="documentType"
            value={form.documentType}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          >
            <option value="DNI (Perú)">
              Documento Nacional de Identidad
            </option>
            <option value="Carnet de Extranjería">
              Carnet de Extranjería
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="documentNumber"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Número de Documento <span className="text-rose-500">*</span>
          </label>

          <input
            id="documentNumber"
            name="documentNumber"
            type="text"
            required
            value={form.documentNumber}
            onChange={onChange}
            placeholder="Ej. 72891044"
            className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Fecha y celular */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="birthDate"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Fecha de Nacimiento <span className="text-rose-500">*</span>
          </label>

          <div className="relative">
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              value={form.birthDate}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Celular <span className="text-rose-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-slate-100 bg-indigo-50 px-3 py-2.5 text-sm font-bold text-indigo-700">
              +51
            </span>

            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              value={form.phoneNumber}
              onChange={onChange}
              placeholder="987 654 321"
              className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}