export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface PacienteApi {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string | null;
  fechaRegistro: string;
}

export type PacienteInput = Omit<PacienteApi, "id" | "fechaRegistro">;

export interface MedicoApi {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  numColegiatura: string;
  activo: boolean;
  especialidadId: number;
}

export interface CitaApi {
  id: number;
  fechaHora: string;
  motivo: string | null;
  estado: EstadoCita;
  pacienteId: number;
  medicoId: number;
  paciente: Pick<PacienteApi, "id" | "nombre" | "apellido">;
  medico: Pick<MedicoApi, "id" | "nombre" | "apellido">;
}

export interface CitaInput {
  pacienteId: number;
  medicoId: number;
  fechaHora: string;
  motivo?: string;
  notas?: string;
}

export interface RespuestaPaginada<T> {
  data: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
