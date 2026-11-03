import { useEffect } from "react";
import { useCitasStore } from "@/stores/citasStore";
import type { EstadoCita } from "@/types/api";

interface OpcionesUseCitas {
  estado?: EstadoCita;
  pacienteId?: number;
  cargarAlMontar?: boolean;
}

export function useCitas({
  estado,
  pacienteId,
  cargarAlMontar = true,
}: OpcionesUseCitas = {}) {
  const citas = useCitasStore((s) => s.citas);
  const citaSeleccionada = useCitasStore((s) => s.citaSeleccionada);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);
  const cargar = useCitasStore((s) => s.cargar);
  const cargarPorPaciente = useCitasStore((s) => s.cargarPorPaciente);
  const seleccionar = useCitasStore((s) => s.seleccionar);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);
  const agregarCita = useCitasStore((s) => s.agregarCita);

  const recargar = () =>
    pacienteId !== undefined ? cargarPorPaciente(pacienteId) : cargar(estado);

  useEffect(() => {
    if (!cargarAlMontar) return;
    if (pacienteId !== undefined) cargarPorPaciente(pacienteId);
    else cargar(estado);
  }, [cargarAlMontar, pacienteId, estado, cargar, cargarPorPaciente]);

  return {
    citas,
    citaSeleccionada,
    cargando,
    error,
    recargar,
    seleccionar,
    actualizarEstado,
    agregarCita,
  };
}
