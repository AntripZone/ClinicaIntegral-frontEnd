import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioSesion } from "@/services/auth";

interface AuthState {
  token: string | null;
  usuario: UsuarioSesion | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: UsuarioSesion) => void;
  logout: () => void;
  actualizarUsuario: (usuario: UsuarioSesion) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      login: (token, usuario) => set({ token, usuario, isAuthenticated: true }),
      actualizarUsuario: (usuario) => set({ usuario }),
      logout: () => set({ token: null, usuario: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);
