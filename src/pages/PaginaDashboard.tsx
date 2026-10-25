import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { useApi } from '@/hooks/useApi';
import type { Metrica } from '../types';
import type { CitaApi, MedicoApi, PacienteApi, RespuestaPaginada } from '@/types/api';

export function PaginaDashboard() {
  const navigate = useNavigate();
  const pacientes = useApi<RespuestaPaginada<PacienteApi>>('/pacientes?limite=1');
  const medicos = useApi<MedicoApi[]>('/medicos');
  const programadas = useApi<CitaApi[]>('/citas?estado=PROGRAMADA');
  const completadas = useApi<CitaApi[]>('/citas?estado=COMPLETADA');

  const [mantenimiento, setMantenimiento] = useState<boolean>(false);

  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: pacientes.data?.total ?? '…',
      descripcion: 'Registrados en el sistema',
      tendencia: 'positiva',
      icono: '🧑‍⚕️',
    },
    {
      id: 'medicos',
      titulo: 'Médicos',
      valor: medicos.data?.length ?? '…',
      descripcion: 'En el staff',
      tendencia: 'neutra',
      icono: '🩺',
    },
    {
      id: 'citas-programadas',
      titulo: 'Citas Programadas',
      valor: programadas.data?.length ?? '…',
      descripcion: 'Pendientes de atención',
      tendencia: 'neutra',
      icono: '📅',
    },
    {
      id: 'citas-completadas',
      titulo: 'Completadas Hoy',
      valor: completadas.data?.length ?? '…',
      descripcion: 'Atenciones finalizadas',
      tendencia: 'positiva',
      icono: '✅',
    },
  ];

  return (
    <div>
      {mantenimiento && (
        <div className="mb-6 rounded-lg bg-rose-600 px-4 py-3 text-center font-medium text-white">
          ⚠️ El sistema está en modo mantenimiento
        </div>
      )}

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge activo={!mantenimiento} />
          <button
            type="button"
            onClick={() => setMantenimiento((prev) => !prev)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {mantenimiento ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/pacientes')}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Ver Pacientes
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricas.map((metrica) => (
          <MetricCard key={metrica.id} metrica={metrica} />
        ))}
      </section>
      <div className="mt-6">
        <Link to="/reportes" className="text-sm font-semibold text-teal-700 hover:underline">
          Ver reportes completos →
        </Link>
      </div>
    </div>
  );
}