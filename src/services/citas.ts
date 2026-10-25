import { api } from "@/lib/axios";
import type { CitaApi, CitaInput, EstadoCita } from "@/types/api";

export const getAll = (
  filtros: { estado?: EstadoCita; pacienteId?: number } = {},
) => api.get<CitaApi[]>("/citas", { params: filtros });

export const create = (data: CitaInput) => api.post<CitaApi>("/citas", data);

export const updateEstado = (id: number, estado: EstadoCita) =>
  api.patch<CitaApi>(`/citas/${id}/estado`, { estado });
