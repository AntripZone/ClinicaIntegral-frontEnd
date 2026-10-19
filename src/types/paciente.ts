export type EstadoPaciente = "activo" | "inactivo" | "en_espera";

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: EstadoPaciente;
}

export const PACIENTES_INICIALES: Paciente[] = [
  {
    id: "1",
    nombre: "Ana",
    apellido: "Pérez",
    email: "ana@mail.com",
    estado: "activo",
  },
  {
    id: "2",
    nombre: "Luis",
    apellido: "Gómez",
    email: "luis@mail.com",
    estado: "inactivo",
  },
  {
    id: "3",
    nombre: "María",
    apellido: "Rojas",
    email: "maria@mail.com",
    estado: "en_espera",
  },
  {
    id: "4",
    nombre: "Carlos",
    apellido: "Díaz",
    email: "carlos@mail.com",
    estado: "activo",
  },
];
