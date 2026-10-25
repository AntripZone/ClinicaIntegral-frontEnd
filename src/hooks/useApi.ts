import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { extraerMensajeError } from "@/lib/errorHandler";

interface ResultadoApi<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

export function useApi<T>(url: string): ResultadoApi<T> {
  const [data, setData] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError(null);

    api
      .get<T>(url, { signal: controller.signal })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(extraerMensajeError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });

    return () => controller.abort();
  }, [url, intento]);

  return { data, cargando, error, recargar };
}
