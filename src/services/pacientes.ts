import { api } from "@/lib/axios";
import type {
  PacienteApi,
  PacienteInput,
  RespuestaPaginada,
} from "@/types/api";

export const getAll = (query?: string, pagina = 1) =>
  api.get<RespuestaPaginada<PacienteApi>>("/pacientes", {
    params: { query: query || undefined, pagina },
  });

export const create = (data: PacienteInput) =>
  api.post<PacienteApi>("/pacientes", data);

export const update = (id: number, data: Partial<PacienteInput>) =>
  api.patch<PacienteApi>(`/pacientes/${id}`, data);

export const remove = (id: number) =>
  api.delete<PacienteApi>(`/pacientes/${id}`);
