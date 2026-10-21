import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import type { Metrica } from '../types';
import type { CitaApi, MedicoApi, PacienteApi } from '@/types/api';
import { api } from '@/lib/axios';

export function PaginaDashboard() {
  const navigate = useNavigate();

  const [totalPacientes, setTotalPacientes] = useState<number | null>(null);
  const [totalMedicos, setTotalMedicos] = useState<number | null>(null);
  const [citasProgramadas, setCitasProgramadas] = useState<number | null>(null);
  const [citasCompletadas, setCitasCompletadas] = useState<number | null>(null);
  const [mantenimiento, setMantenimiento] = useState<boolean>(false);

  useEffect(() => {
    api.get<PacienteApi[]>('/pacientes').then((res) => setTotalPacientes(res.data.length));
  }, []);

  useEffect(() => {
    api.get<MedicoApi[]>('/medicos').then((res) => setTotalMedicos(res.data.length));
  }, []);

  useEffect(() => {
    api.get<CitaApi[]>('/citas?estado=PROGRAMADA').then((res) => setCitasProgramadas(res.data.length));
  }, []);

  useEffect(() => {
    api.get<CitaApi[]>('/citas?estado=COMPLETADA').then((res) => setCitasCompletadas(res.data.length));
  }, []);

  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: totalPacientes ?? '…',
      descripcion: 'Registrados en el sistema',
      tendencia: 'positiva',
      icono: '🧑‍⚕️',
    },
    {
      id: 'medicos',
      titulo: 'Médicos',
      valor: totalMedicos ?? '…',
      descripcion: 'En el staff',
      tendencia: 'neutra',
      icono: '🩺',
    },
    {
      id: 'citas-programadas',
      titulo: 'Citas Programadas',
      valor: citasProgramadas ?? '…',
      descripcion: 'Pendientes de atención',
      tendencia: 'neutra',
      icono: '📅',
    },
    {
      id: 'citas-completadas',
      titulo: 'Completadas Hoy',
      valor: citasCompletadas ?? '…',
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
    </div>
  );
}