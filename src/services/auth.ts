import { api } from "@/lib/axios";
import type { LoginFormData } from "@/schemas/loginSchema";

export type Rol = "RECEPCIONISTA" | "MEDICO" | "GERENCIA";

export interface UsuarioSesion {
  id: number;
  email: string;
  rol: Rol;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioSesion;
}

export async function login(datos: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);
  return data;
}
