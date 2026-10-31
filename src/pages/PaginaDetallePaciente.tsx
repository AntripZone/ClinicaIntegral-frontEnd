import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PaginaNotFound from '@/pages/PaginaNotFound';
import { useCitasStore } from '@/stores/citasStore';
import { useApi } from '@/hooks/useApi';
import type { PacienteApi } from '@/types/api';
import { Spinner } from '@/shared/components/ui';

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pacienteId = Number(id);

  const { data: paciente, cargando: cargandoPaciente } = useApi<PacienteApi>(`/pacientes/${id}`);

  const citas = useCitasStore((s) => s.citas);
  const cargandoCitas = useCitasStore((s) => s.cargando);
  const citaSeleccionada = useCitasStore((s) => s.citaSeleccionada);
  const cargarPorPaciente = useCitasStore((s) => s.cargarPorPaciente);
  const seleccionar = useCitasStore((s) => s.seleccionar);

  useEffect(() => {
    if (pacienteId) cargarPorPaciente(pacienteId);
  }, [pacienteId, cargarPorPaciente]);

  if (cargandoPaciente)
    return <Spinner fullscreen etiqueta="Cargando paciente" />;

  if (!paciente) return <PaginaNotFound />;

  return (
    <div className="max-w-2xl space-y-6">
      <button type="button" onClick={() => navigate(-1)} className="text-sm font-medium text-teal-700 hover:underline">
        ← Volver
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-800">{paciente.nombre} {paciente.apellido}</h1>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="font-medium text-slate-500">Email</dt>
          <dd className="text-slate-800">{paciente.email}</dd>
          <dt className="font-medium text-slate-500">Teléfono</dt>
          <dd className="text-slate-800">{paciente.telefono}</dd>
          <dt className="font-medium text-slate-500">Nacimiento</dt>
          <dd className="text-slate-800">{paciente.fechaNacimiento.split('T')[0]}</dd>
          <dt className="font-medium text-slate-500">Dirección</dt>
          <dd className="text-slate-800">{paciente.direccion ?? '—'}</dd>
        </dl>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-800">Citas</h2>
        {cargandoCitas ? (
          <div className="mt-4"><Spinner etiqueta="Cargando citas" /></div>
        ) : citas.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Este paciente no tiene citas.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {citas.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => seleccionar(c.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    citaSeleccionada?.id === c.id ? 'bg-teal-50' : ''
                  }`}
                >
                  {new Date(c.fechaHora).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })} · {c.estado}
                </button>
              </li>
            ))}
          </ul>
        )}

        {citaSeleccionada && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
            <p><span className="font-medium">Médico:</span> {citaSeleccionada.medico.nombre} {citaSeleccionada.medico.apellido}</p>
            <p><span className="font-medium">Motivo:</span> {citaSeleccionada.motivo ?? '—'}</p>
            <p><span className="font-medium">Estado:</span> {citaSeleccionada.estado}</p>
          </div>
        )}
      </div>
    </div>
  );
}