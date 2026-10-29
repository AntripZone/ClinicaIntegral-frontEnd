import { api } from "@/lib/axios";
import type { LoginFormData } from "@/schemas/loginSchema";

export type Rol = "RECEPCIONISTA" | "MEDICO" | "GERENCIA";

export interface UsuarioSesion {
  id: number;
  nombre: string | null;
  email: string;
  rol: Rol;
  telefono: string | null;
  fotoUrl: string | null;
}

export async function actualizarPerfil(
  formData: FormData,
): Promise<UsuarioSesion> {
  const { data } = await api.put<UsuarioSesion>("/auth/perfil", formData);
  return data;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioSesion;
}

export async function login(datos: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);
  return data;
}
