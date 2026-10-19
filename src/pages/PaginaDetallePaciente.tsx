import { useNavigate, useParams } from 'react-router-dom';
import { PACIENTES_INICIALES } from '@/types/paciente';
import type { EstadoPaciente } from '@/types/paciente';
import PaginaNotFound from '@/pages/PaginaNotFound';

const estiloPorEstado: Record<EstadoPaciente, string> = {
  activo: 'bg-emerald-100 text-emerald-700',
  inactivo: 'bg-slate-100 text-slate-600',
  en_espera: 'bg-amber-100 text-amber-700',
};

const etiquetaPorEstado: Record<EstadoPaciente, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  en_espera: 'En espera',
};

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const paciente = PACIENTES_INICIALES.find(p => p.id === id);

  if (!paciente) {
    return <PaginaNotFound />;
  }

  return (
    <div className="max-w-xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm font-medium text-teal-700 hover:underline"
      >
        ← Volver
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-xl font-semibold text-teal-700">
            {paciente.nombre.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {paciente.nombre} {paciente.apellido}
            </h1>
            <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${estiloPorEstado[paciente.estado]}`}>
              {etiquetaPorEstado[paciente.estado]}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="font-medium text-slate-500">ID</dt>
          <dd className="text-slate-800">{paciente.id}</dd>
          <dt className="font-medium text-slate-500">Nombre</dt>
          <dd className="text-slate-800">{paciente.nombre}</dd>
          <dt className="font-medium text-slate-500">Apellido</dt>
          <dd className="text-slate-800">{paciente.apellido}</dd>
          <dt className="font-medium text-slate-500">Email</dt>
          <dd className="text-slate-800">{paciente.email}</dd>
          <dt className="font-medium text-slate-500">Estado</dt>
          <dd className="text-slate-800">{etiquetaPorEstado[paciente.estado]}</dd>
        </dl>
      </div>
    </div>
  );
}