import { useEffect } from "react";
import { usePacientesStore } from "@/stores/pacientesStore";

export function usePacientes(query?: string) {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const total = usePacientesStore((s) => s.total);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);
  const cargar = usePacientesStore((s) => s.cargar);
  const crear = usePacientesStore((s) => s.crear);
  const actualizar = usePacientesStore((s) => s.actualizar);
  const eliminar = usePacientesStore((s) => s.eliminar);

  useEffect(() => {
    cargar(query || undefined);
  }, [query, cargar]);

  const recargar = () => cargar(query || undefined);

  return {
    pacientes,
    total,
    cargando,
    error,
    recargar,
    crear,
    actualizar,
    eliminar,
  };
}
