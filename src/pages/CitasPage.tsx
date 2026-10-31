import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertaBanner,
  EstadoVacio,
  ModalConfirmacion,
  SkeletonCitaRow,
} from '@/shared/components/ui';
import { useCitasStore } from '@/stores/citasStore';
import { useFiltrosStore } from '@/stores/filtrosStore';
import type { EstadoCita } from '@/types/api';

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

export default function PaginaCitas() {
  const navigate = useNavigate();
  const citas = useCitasStore((s) => s.citas);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);
  const cargar = useCitasStore((s) => s.cargar);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);

  const [aCancelar, setACancelar] = useState<number | null>(null);
  const [cancelando, setCancelando] = useState(false);

  const estadoFiltro = useFiltrosStore((s) => s.estadoCitaFiltro);
  const setEstadoFiltro = useFiltrosStore((s) => s.setEstadoCita);

  const recargar = () => cargar(estadoFiltro === 'Todos' ? undefined : estadoFiltro);

  useEffect(() => {
    cargar(estadoFiltro === 'Todos' ? undefined : estadoFiltro);
  }, [estadoFiltro, cargar]);

  const cambiarEstado = (id: number, estado: EstadoCita) => {
    if (estado === 'CANCELADA') {
      setACancelar(id);
      return;
    }
    actualizarEstado(id, estado).catch(() => toast.error('Cambio revertido'));
  };

  const confirmarCancelacion = async () => {
    if (aCancelar === null) return;
    setCancelando(true);
    try {
      await actualizarEstado(aCancelar, 'CANCELADA');
      toast.success('Cita cancelada');
    } catch {
      toast.error('Cambio revertido');
    } finally {
      setCancelando(false);
      setACancelar(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Citas</h1>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value as EstadoCita | 'Todos')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="Todos">Todos los estados</option>
          <option value="PROGRAMADA">Programadas</option>
          <option value="COMPLETADA">Completadas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
      </div>

      {cargando ? (
       <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {Array.from({ length: 5 }, (_, i) => <SkeletonCitaRow key={i} />)}
       </ul>
      ) : error ? (
        <AlertaBanner
          tipo="error"
          titulo="No se pudieron cargar las citas"
          mensaje={error}
          accion={{ label: 'Reintentar', onClick: recargar }}
        />
      ) : citas.length === 0 ? (
         <EstadoVacio
            titulo="No hay citas con este filtro"
            accion={
              estadoFiltro === 'Todos'
                ? { label: 'Agendar cita', onClick: () => navigate('/citas/nueva') }
                : { label: 'Ver todos los estados', onClick: () => setEstadoFiltro('Todos') }
            }
          />
      ) : (
        <>
          <p className="text-sm text-slate-500">{citas.length} cita(s)</p>
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            {citas.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-slate-800">{c.paciente.nombre} {c.paciente.apellido}</p>
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
        </>
      )}
      <ModalConfirmacion
        abierto={aCancelar !== null}
        titulo="Cancelar cita"
        mensaje="¿Seguro que quieres cancelar esta cita? El paciente perderá su horario."
        textoConfirmar="Cancelar cita"
        textoCargando="Cancelando..."
        cargando={cancelando}
        onConfirmar={confirmarCancelacion}
        onCancelar={() => setACancelar(null)}
      />
    </div>
  );
}