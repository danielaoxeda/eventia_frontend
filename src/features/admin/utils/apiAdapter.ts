import axios from "axios";

interface BackendErrorResponse {
  status?: number;
  message?: string;
  path?: string;
  errors?: Record<string, string>;
}

// Extrae el mensaje de error devuelto por el backend
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (data && typeof data === "object") {
      if (data.errors && typeof data.errors === "object") {
        const firstFieldError = Object.values(data.errors).find(
          (msg): msg is string => typeof msg === "string" && msg.length > 0
        );
        if (firstFieldError) return firstFieldError;
      }
      if (typeof data.message === "string" && data.message.length > 0) {
        return data.message;
      }
    }

    if (status === 401) {
      return "Sesión no iniciada o expirada.";
    }
    if (status === 403) {
      return "No tienes permisos para realizar esta acción.";
    }
    if (status) {
      return `El servidor respondió con error ${status}.`;
    }

    return "No se pudo conectar con el servidor.";
  }
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}
