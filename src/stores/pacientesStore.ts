import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as pacientesService from "@/services/pacientes";
import { extraerMensajeError } from "@/lib/errorHandler";
import type { PacienteApi, PacienteInput } from "@/types/api";

interface PacientesState {
  pacientes: PacienteApi[];
  total: number;
  pagina: number;
  totalPaginas: number;
  cargando: boolean;
  error: string | null;
  cargar: (query?: string) => Promise<void>;
  crear: (data: PacienteInput) => Promise<void>;
  actualizar: (id: number, data: Partial<PacienteInput>) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      total: 0,
      pagina: 1,
      totalPaginas: 1,
      cargando: false,
      error: null,

      cargar: async (query) => {
        set({ cargando: true, error: null }, false, "pacientes/cargar");
        try {
          const res = await pacientesService.getAll(query);
          set(
            {
              pacientes: res.data.data,
              total: res.data.total,
              pagina: res.data.pagina,
              totalPaginas: res.data.totalPaginas,
              cargando: false,
            },
            false,
            "pacientes/cargar:ok",
          );
        } catch (err) {
          set(
            { error: extraerMensajeError(err), cargando: false },
            false,
            "pacientes/cargar:error",
          );
        }
      },

      crear: async (data) => {
        const res = await pacientesService.create(data);
        set(
          (s) => ({
            pacientes: [...s.pacientes, res.data],
            total: s.total + 1,
          }),
          false,
          "pacientes/crear",
        );
      },

      actualizar: async (id, data) => {
        const res = await pacientesService.update(id, data);
        set(
          (s) => ({
            pacientes: s.pacientes.map((p) => (p.id === id ? res.data : p)),
          }),
          false,
          "pacientes/actualizar",
        );
      },

      eliminar: async (id) => {
        await pacientesService.remove(id);
        set(
          (s) => ({
            pacientes: s.pacientes.filter((p) => p.id !== id),
            total: s.total - 1,
          }),
          false,
          "pacientes/eliminar",
        );
      },
    }),
    { name: "PacientesStore" },
  ),
);
