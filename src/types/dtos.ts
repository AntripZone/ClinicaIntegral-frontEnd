import type { CitaApi, MedicoApi, PacienteApi } from "./api";

export type CrearPacienteDTO = Omit<PacienteApi, "id" | "fechaRegistro">;
export type ActualizarPacienteDTO = Partial<CrearPacienteDTO>;
export type ResumenPaciente = Pick<
  PacienteApi,
  "id" | "nombre" | "apellido" | "email"
>;

export type CrearMedicoDTO = Omit<MedicoApi, "id">;
export type ActualizarMedicoDTO = Partial<CrearMedicoDTO>;
export type ResumenMedico = Pick<MedicoApi, "id" | "nombre" | "apellido">;

export type CrearCitaDTO = Pick<
  CitaApi,
  "pacienteId" | "medicoId" | "fechaHora"
> &
  Partial<Pick<CitaApi, "motivo" | "notas">>;
export type ActualizarEstadoCitaDTO = Pick<CitaApi, "estado">;
