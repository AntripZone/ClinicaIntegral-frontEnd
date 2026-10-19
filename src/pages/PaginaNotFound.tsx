import { Link } from 'react-router-dom';

export default function PaginaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-7xl" aria-hidden="true">🔍</span>
      <h1 className="mt-4 text-5xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-500">La página que buscas no existe o fue movida.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Ir al inicio
      </Link>
    </div>
  );
}