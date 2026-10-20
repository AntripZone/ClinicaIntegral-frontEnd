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
export interface CitaApi {
  id: number;
  estado: "PROGRAMADA" | "COMPLETADA" | "CANCELADA";
  fechaHora: string;
}
