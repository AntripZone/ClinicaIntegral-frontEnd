import axios from "axios";

interface ErrorBackend {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError<ErrorBackend>(err)) {
    if (!err.response) {
      return err.code === "ECONNABORTED"
        ? "El servidor tardó demasiado en responder"
        : "No se puede conectar al servidor";
    }

    const mensaje = err.response.data?.message;

    if (Array.isArray(mensaje)) return mensaje.join(". ");
    return mensaje ?? "Error del servidor";
  }

  if (err instanceof Error) return err.message;
  return "Error inesperado";
}
