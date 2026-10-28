import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function PaginaSinAcceso() {
  const rol = useAuthStore((s) => s.usuario?.rol);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-7xl" aria-hidden="true">🔒</span>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">Sin acceso</h1>
      <p className="mt-2 max-w-md text-slate-500">
        Tu rol{rol ? <> (<span className="font-medium">{rol}</span>)</> : null} no tiene permiso para ver esta sección.
        Si crees que es un error, contacta a un administrador.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Volver al inicio
      </Link>
    </div>
  );
}