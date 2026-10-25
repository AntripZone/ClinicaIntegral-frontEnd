import { api } from "@/lib/axios";
import type { CitaApi, EstadoCita } from "@/types/api";
import type { ActualizarEstadoCitaDTO, CrearCitaDTO } from "@/types/dtos";

export const getAll = (
  filtros: { estado?: EstadoCita; pacienteId?: number } = {},
) => api.get<CitaApi[]>("/citas", { params: filtros });

export const create = (data: CrearCitaDTO) => api.post<CitaApi>("/citas", data);

export const updateEstado = (id: number, estado: EstadoCita) =>
  api.patch<CitaApi>(`/citas/${id}/estado`, {
    estado,
  } satisfies ActualizarEstadoCitaDTO);
