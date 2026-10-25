import { api } from "@/lib/axios";
import type { PacienteApi, RespuestaPaginada } from "@/types/api";
import type { ActualizarPacienteDTO, CrearPacienteDTO } from "@/types/dtos";

export const getAll = (query?: string, pagina = 1) =>
  api.get<RespuestaPaginada<PacienteApi>>("/pacientes", {
    params: { query: query || undefined, pagina },
  });

export const create = (data: CrearPacienteDTO) =>
  api.post<PacienteApi>("/pacientes", data);

export const update = (id: number, data: Partial<ActualizarPacienteDTO>) =>
  api.patch<PacienteApi>(`/pacientes/${id}`, data);

export const remove = (id: number) =>
  api.delete<PacienteApi>(`/pacientes/${id}`);
