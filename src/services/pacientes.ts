import { api } from "@/lib/axios";
import type { PacienteApi, PacienteInput } from "@/types/api";

export const getAll = (query?: string) =>
  api.get<PacienteApi[]>("/pacientes", {
    params: query ? { query } : undefined,
  });

export const create = (data: PacienteInput) =>
  api.post<PacienteApi>("/pacientes", data);

export const update = (id: number, data: Partial<PacienteInput>) =>
  api.patch<PacienteApi>(`/pacientes/${id}`, data);

export const remove = (id: number) =>
  api.delete<PacienteApi>(`/pacientes/${id}`);
