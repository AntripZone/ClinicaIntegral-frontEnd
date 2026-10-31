import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as citasService from "@/services/citas";
import { extraerMensajeError } from "@/lib/errorHandler";
import type { CitaApi, EstadoCita } from "@/types/api";
import type { CrearCitaDTO } from "@/types/dtos";

interface CitasState {
  citas: CitaApi[];
  citaSeleccionada: CitaApi | null;
  cargando: boolean;
  error: string | null;
  cargar: (estado?: EstadoCita) => Promise<void>;
  cargarPorPaciente: (pacienteId: number) => Promise<void>;
  seleccionar: (id: number | null) => void;
  actualizarEstado: (id: number, estado: EstadoCita) => Promise<void>;
  agregarCita: (data: CrearCitaDTO) => Promise<void>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: true,
      error: null,

      cargar: async (estado) => {
        set({ cargando: true, error: null }, false, "citas/cargar");
        try {
          const res = await citasService.getAll({ estado });
          set({ citas: res.data, cargando: false }, false, "citas/cargar:ok");
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "citas/cargar:error",
          );
        }
      },

      cargarPorPaciente: async (pacienteId) => {
        set(
          { cargando: true, error: null, citaSeleccionada: null },
          false,
          "citas/cargarPorPaciente",
        );
        try {
          const res = await citasService.getAll({ pacienteId });
          set(
            { citas: res.data, cargando: false },
            false,
            "citas/cargarPorPaciente:ok",
          );
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "citas/cargarPorPaciente:error",
          );
        }
      },

      seleccionar: (id) => {
        const cita =
          id === null ? null : (get().citas.find((c) => c.id === id) ?? null);
        set({ citaSeleccionada: cita }, false, "citas/seleccionar");
      },

      actualizarEstado: async (id, estado) => {
        const anterior = get().citas.find((c) => c.id === id)?.estado;
        if (!anterior) return;

        const aplicar = (nuevo: EstadoCita) => (s: CitasState) => ({
          citas: s.citas.map((c) =>
            c.id === id ? { ...c, estado: nuevo } : c,
          ),
          citaSeleccionada:
            s.citaSeleccionada?.id === id
              ? { ...s.citaSeleccionada, estado: nuevo }
              : s.citaSeleccionada,
        });

        set(aplicar(estado), false, "citas/actualizarEstado:optimista");
        try {
          await citasService.updateEstado(id, estado);
        } catch (err) {
          set(aplicar(anterior), false, "citas/actualizarEstado:revertido");
          throw err;
        }
      },

      agregarCita: async (data) => {
        const res = await citasService.create(data);
        set(
          (s) => ({ citas: [...s.citas, res.data] }),
          false,
          "citas/agregarCita",
        );
      },
    }),
    { name: "CitasStore" },
  ),
);
