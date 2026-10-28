import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { Rol } from '@/services/auth';

interface RutaProtegidaProps {
  rolesPermitidos?: Rol[];
}

export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const usuario = useAuthStore((s) => s.usuario);

  if (!isAuthenticated || !usuario) return <Navigate to="/login" replace />;

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return <Outlet />;
}