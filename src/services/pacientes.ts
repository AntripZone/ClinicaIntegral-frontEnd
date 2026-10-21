import { api } from "@/lib/axios";
import type { PacienteApi, PacienteInput } from "@/types/api";

export const getAll = () => api.get<PacienteApi[]>("/pacientes");

export const create = (data: PacienteInput) =>
  api.post<PacienteApi>("/pacientes", data);

export const update = (id: number, data: Partial<PacienteInput>) =>
  api.patch<PacienteApi>(`/pacientes/${id}`, data);

export const remove = (id: number) =>
  api.delete<PacienteApi>(`/pacientes/${id}`);
