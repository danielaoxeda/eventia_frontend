import React from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import type { RegisterRequest } from "../types/register.types";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

interface CredentialsSectionProps {
  form: RegisterRequest;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  strength: PasswordStrength;
}

export default function CredentialsSection({
  form,
  onChange,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  strength,
}: CredentialsSectionProps) {
  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.password === form.confirmPassword;

  const passwordsMismatch =
    form.confirmPassword.length > 0 &&
    form.password !== form.confirmPassword;

  return (
    <div className="space-y-4 pt-4">
      <div className="border-l-4 border-rose-600 pl-3 py-0.5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          CREDENCIALES DE ACCESO
        </h2>
      </div>

      {/* Correo */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-bold text-slate-800 mb-1.5"
        >
          Correo Electrónico <span className="text-rose-500">*</span>
        </label>

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={onChange}
            placeholder="roberto.zarate@gmail.com"
            className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 py-2.5 pl-10 pr-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Contraseñas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Crear Contraseña <span className="text-rose-500">*</span>
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={onChange}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Ver contraseña"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-bold text-slate-800 mb-1.5"
          >
            Confirmar Contraseña <span className="text-rose-500">*</span>
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Repite la contraseña"
              className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 px-3.5 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Ver contraseña"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fortaleza y coincidencia */}
      <div className="flex flex-wrap items-center justify-between text-[11px] gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">
            Fortaleza:
          </span>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  step <= strength.score
                    ? strength.color
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <span className="font-bold text-slate-700">
            {strength.label}
          </span>
        </div>

        <div>
          {passwordsMatch && (
            <span className="font-bold text-emerald-600">
              ✓ Las contraseñas coinciden
            </span>
          )}

          {passwordsMismatch && (
            <span className="font-medium text-slate-400">
              Debe coincidir con la contraseña ingresada
            </span>
          )}

          {!form.confirmPassword && (
            <span className="font-medium text-slate-400">
              Debe coincidir con la contraseña ingresada
            </span>
          )}
        </div>
      </div>
    </div>
  );
}