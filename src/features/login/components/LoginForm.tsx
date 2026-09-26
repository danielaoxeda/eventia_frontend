import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { login } from "../services/loginService";
import type { LoginRequest } from "../types/login.types";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<LoginRequest>({
    username: "emilys",
    password: "emilyspass",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login(form);

      console.log("Usuario autenticado:", data);

      localStorage.setItem("accessToken", data.accessToken);

      alert(`Bienvenido, ${data.firstName}`);
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Correo */}
      <div>
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-bold text-slate-800"
        >
          Correo electrónico
        </label>

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="ej. usuario@eventia.com"
            required
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-bold text-slate-800"
          >
            Contraseña
          </label>

          <button
            type="button"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Recordar sesión */}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 accent-indigo-600"
        />

        <span>Recordar mi sesión en este dispositivo</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Iniciando sesión..."
          : "Iniciar Sesión en Eventia"}
      </button>
    </form>
  );
}