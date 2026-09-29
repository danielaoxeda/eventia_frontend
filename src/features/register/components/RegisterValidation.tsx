import type { RegisterRequest } from "../types/register.types";

export function validateRegisterForm(
  form: RegisterRequest
): string | null {
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const email = form.email.trim().toLowerCase();
  const documentNumber = form.documentNumber.trim();
  const phoneNumber = form.phoneNumber.trim();

  // =========================
  // NOMBRES
  // =========================

  if (!firstName) {
    return "Ingresa tus nombres.";
  }

  if (
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(
      firstName
    )
  ) {
    return "El nombre solo puede contener letras.";
  }

  // =========================
  // APELLIDOS
  // =========================

  if (!lastName) {
    return "Ingresa tus apellidos.";
  }

  if (
    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(
      lastName
    )
  ) {
    return "El apellido solo puede contener letras.";
  }

  // =========================
  // DOCUMENTO
  // =========================

  if (form.documentType === "DNI (Perú)") {
    if (!/^\d{8}$/.test(documentNumber)) {
      return "El DNI debe contener exactamente 8 números.";
    }
  }

  if (
    form.documentType === "Carnet de Extranjería"
  ) {
    if (
      !/^[A-Za-z0-9]{9,12}$/.test(
        documentNumber
      )
    ) {
      return "El Carnet de Extranjería debe contener entre 9 y 12 caracteres alfanuméricos.";
    }
  }

  // =========================
  // CELULAR
  // =========================

  if (!/^9\d{8}$/.test(phoneNumber)) {
    return "El celular debe contener 9 números y comenzar con 9.";
  }

  // =========================
  // CORREO
  // =========================

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Ingresa un correo electrónico válido.";
  }

  // =========================
  // CONTRASEÑA
  // =========================

  if (form.password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (!/[A-Z]/.test(form.password)) {
    return "La contraseña debe contener al menos una letra mayúscula.";
  }

  if (!/[0-9]/.test(form.password)) {
    return "La contraseña debe contener al menos un número.";
  }

  // =========================
  // CONFIRMACIÓN
  // =========================

  if (
    form.password !== form.confirmPassword
  ) {
    return "Las contraseñas no coinciden.";
  }

  return null;
}

// =====================================================
// SANITIZACIÓN DE CAMPOS
// =====================================================

export function sanitizeRegisterField(
  name: string,
  value: string,
  documentType: string
): string {
  // Nombres y apellidos
  if (
    name === "firstName" ||
    name === "lastName"
  ) {
    return value.replace(
      /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
      ""
    );
  }

  // Documento
  if (name === "documentNumber") {
    if (documentType === "DNI (Perú)") {
      return value
        .replace(/\D/g, "")
        .slice(0, 8);
    }

    if (
      documentType ===
      "Carnet de Extranjería"
    ) {
      return value
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 12)
        .toUpperCase();
    }
  }

  // Celular
  if (name === "phoneNumber") {
    return value
      .replace(/\D/g, "")
      .slice(0, 9);
  }

  return value;
}