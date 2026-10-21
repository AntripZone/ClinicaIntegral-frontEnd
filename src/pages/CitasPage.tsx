import { useEffect, useOptimistic, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import * as citasService from '@/services/citas';
import type { CitaApi, EstadoCita } from '@/types/api';

const estiloPorEstado: Record<EstadoCita, string> = {
  PROGRAMADA: 'bg-sky-100 text-sky-700',
  COMPLETADA: 'bg-emerald-100 text-emerald-700',
  CANCELADA: 'bg-slate-100 text-slate-600',
};

const etiquetaPorEstado: Record<EstadoCita, string> = {
  PROGRAMADA: 'Programada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

type CambioEstado = { id: number; estado: EstadoCita };

export default function PaginaCitas() {
  const [citas, setCitas] = useState<CitaApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();

  const [citasOptimistas, aplicarCambioOptimista] = useOptimistic(
    citas,
    (actuales: CitaApi[], cambio: CambioEstado) =>
      actuales.map((c) => (c.id === cambio.id ? { ...c, estado: cambio.estado } : c)),
  );

  const cargarCitas = () => {
    setCargando(true);
    setError(false);
    citasService
      .getAll()
      .then((res) => setCitas(res.data))
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  };

  useEffect(cargarCitas, []);

  const cambiarEstado = (id: number, estado: EstadoCita) => {
    startTransition(async () => {
      aplicarCambioOptimista({ id, estado });
      try {
        await citasService.updateEstado(id, estado);
        startTransition(() => {
          setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado } : c)));
        });
      } catch {
        toast.error('Cambio revertido');
      }
    });
  };

  if (cargando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="font-medium text-rose-700">No se pudieron cargar las citas.</p>
        <button
          type="button"
          onClick={cargarCitas}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Citas</h1>
      <p className="text-sm text-slate-500">{citas.length} cita(s)</p>

      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
        {citasOptimistas.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-slate-800">
                {c.paciente.nombre} {c.paciente.apellido}
              </p>
              <p className="text-sm text-slate-500">
                Dr(a). {c.medico.nombre} {c.medico.apellido} ·{' '}
                {new Date(c.fechaHora).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estiloPorEstado[c.estado]}`}>
                {etiquetaPorEstado[c.estado]}
              </span>
              <select
                value={c.estado}
                onChange={(e) => cambiarEstado(c.id, e.target.value as EstadoCita)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
              >
                <option value="PROGRAMADA">Programada</option>
                <option value="COMPLETADA">Completada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}