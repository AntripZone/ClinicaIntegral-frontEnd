import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { EstadoCita } from "@/types/api";

interface FiltrosValores {
  queryPacientes: string;
  especialidadFiltro: number | null;
  estadoCitaFiltro: EstadoCita | "Todos";
}

interface FiltrosState extends FiltrosValores {
  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidadId: number | null) => void;
  setEstadoCita: (estado: EstadoCita | "Todos") => void;
  resetFiltros: () => void;
}

const filtrosIniciales: FiltrosValores = {
  queryPacientes: "",
  especialidadFiltro: null,
  estadoCitaFiltro: "Todos",
};

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...filtrosIniciales,
      setQueryPacientes: (queryPacientes) =>
        set({ queryPacientes }, false, "filtros/query"),
      setEspecialidad: (especialidadFiltro) =>
        set({ especialidadFiltro }, false, "filtros/especialidad"),
      setEstadoCita: (estadoCitaFiltro) =>
        set({ estadoCitaFiltro }, false, "filtros/estadoCita"),
      resetFiltros: () => set(filtrosIniciales, false, "filtros/reset"),
    }),
    { name: "FiltrosStore" },
  ),
);
