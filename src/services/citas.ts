import { api } from "@/lib/axios";
import type { CitaApi, EstadoCita, RespuestaPaginada } from "@/types/api";
import type { ActualizarEstadoCitaDTO, CrearCitaDTO } from "@/types/dtos";

export const getAll = (
  filtros: { estado?: EstadoCita; pacienteId?: number } = {},
) => api.get<CitaApi[]>("/citas", { params: filtros });

export const create = (data: CrearCitaDTO) => api.post<CitaApi>("/citas", data);

export const updateEstado = (id: number, estado: EstadoCita) =>
  api.patch<CitaApi>(`/citas/${id}/estado`, {
    estado,
  } satisfies ActualizarEstadoCitaDTO);

export const getHistorial = ({
  pagina,
  estado,
  limite = 10,
  signal,
}: {
  pagina: number;
  estado?: EstadoCita;
  limite?: number;
  signal?: AbortSignal;
}) =>
  api.get<RespuestaPaginada<CitaApi>>("/citas/historial", {
    params: { pagina, limite, estado },
    signal,
  });
