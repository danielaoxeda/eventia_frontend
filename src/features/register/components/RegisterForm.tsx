import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { register } from "../services/registerService";
import type { RegisterRequest } from "../types/register.types";

import PersonalDataSection from "./PersonalDataSection";
import CredentialsSection from "./CredentialsSection";
import RegisterMessages from "./RegisterMessages";

import {
  sanitizeRegisterField,
  validateRegisterForm,
} from "./RegisterValidation";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    documentType: "DNI (Perú)",
    documentNumber: "",
    birthDate: "",
    phonePrefix: "+51",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (name === "documentType") {
    setForm((prev) => ({
      ...prev,
      documentType: value,
      documentNumber:
        value === "DNI (Perú)"
          ? prev.documentNumber.replace(/\D/g, "").slice(0, 8)
          : prev.documentNumber
              .replace(/[^a-zA-Z0-9]/g, "")
              .slice(0, 12)
              .toUpperCase(),
    }));

    return;
  }

  const newValue = sanitizeRegisterField(
    name,
    value,
    form.documentType
  );

  setForm((prev) => ({
    ...prev,
    [name]: newValue,
  }));
};
  const getPasswordStrength = (password: string) => {
    if (!password) {
      return {
        score: 0,
        label: "Muy débil",
        color: "bg-slate-200",
      };
    }

    if (password.length < 6) {
      return {
        score: 1,
        label: "Muy débil",
        color: "bg-red-500",
      };
    }

    if (password.length < 8) {
      return {
        score: 2,
        label: "Débil",
        color: "bg-amber-500",
      };
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return {
        score: 4,
        label: "Fuerte",
        color: "bg-emerald-500",
      };
    }

    return {
      score: 3,
      label: "Aceptable",
      color: "bg-indigo-500",
    };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const validationError = validateRegisterForm(form);

  if (validationError) {
    setError(validationError);
    return;
  }

  setLoading(true);

  try {
    const response = await register(form);

    setSuccess(
      `¡Cuenta creada con éxito! Bienvenido, ${response.firstName}. Redirigiendo al inicio de sesión...`
    );

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } catch (err) {
    console.error(err);

    setError(
      "Ocurrió un error al registrar la cuenta. Inténtalo nuevamente."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Crea tu cuenta en Eventia
        </h1>

        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
          Ingresa tus datos personales.
        </p>
      </div>

      {/* Datos personales */}
      <PersonalDataSection
        form={form}
        onChange={handleChange}
      />

      {/* Credenciales */}
      <CredentialsSection
        form={form}
        onChange={handleChange}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onTogglePassword={() =>
          setShowPassword((prev) => !prev)
        }
        onToggleConfirmPassword={() =>
          setShowConfirmPassword((prev) => !prev)
        }
        strength={strength}
      />

      {/* Mensajes */}
      <RegisterMessages
        error={error}
        success={success}
      />

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          "Creando Cuenta..."
        ) : (
          <>
            Crear Cuenta
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Login */}
      <div className="text-center pt-2">
        <p className="text-xs font-medium text-slate-500">
          ¿Ya tienes una cuenta en Eventia?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </form>
  );
}