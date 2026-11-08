import axios from "axios";

interface BackendErrorResponse {
  status?: number;
  message?: string;
  path?: string;
  errors?: Record<string, string>;
}

/**
 * Extrae el mensaje de error devuelto por GlobalExceptionHandler (ErrorResponse) del backend.
 * Prioriza los mensajes de validación por campo (`errors`) y luego el mensaje general (`message`).
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
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
    if (error.response) return `El servidor respondió con error ${error.response.status}.`;
    return "No se pudo conectar con el servidor.";
  }
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}
