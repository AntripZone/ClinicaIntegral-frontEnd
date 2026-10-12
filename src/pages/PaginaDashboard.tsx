import { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import type { Metrica } from '../types';

export function PaginaDashboard() {
  const [pacientes, setPacientes] = useState(128);
  const [citasHoy] = useState(24);
  const [consultasPendientes] = useState(7);
  const [disponibilidad] = useState('92%');
  const [mantenimiento, setMantenimiento] = useState<boolean>(false);

  const incrementarPacientes = () => setPacientes(prev => prev + 1);
  const decrementarPacientes = () => setPacientes(prev => Math.max(0, prev - 1));
  const alternarMantenimiento = () => setMantenimiento(prev => !prev);

  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: pacientes,
      descripcion: 'Registrados en el sistema',
      tendencia: 'positiva',
      icono: '🧑‍⚕️',
    },
    {
      id: 'citas-hoy',
      titulo: 'Citas Hoy',
      valor: citasHoy,
      descripcion: 'Agendadas para hoy',
      tendencia: 'neutra',
      icono: '📅',
    },
    {
      id: 'consultas-pendientes',
      titulo: 'Consultas Pendientes',
      valor: consultasPendientes,
      descripcion: 'Requieren atención',
      tendencia: 'negativa',
      icono: '⏳',
    },
    {
      id: 'disponibilidad',
      titulo: 'Disponibilidad',
      valor: disponibilidad,
      descripcion: 'Del personal médico',
      tendencia: 'positiva',
      icono: '✅',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {mantenimiento && (
        <div className="bg-rose-600 px-4 py-3 text-center font-medium text-white">
          ⚠️ El sistema está en modo mantenimiento
        </div>
      )}

      <main className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <StatusBadge activo={!mantenimiento} />
            <button
              onClick={alternarMantenimiento}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {mantenimiento ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map(metrica => (
            <MetricCard key={metrica.id} metrica={metrica} />
          ))}
        </section>

        <div className="mt-6 flex items-center gap-2">
          <span className="text-sm text-slate-600">Pacientes:</span>
          <button
            onClick={decrementarPacientes}
            className="h-9 w-9 rounded-lg bg-slate-200 font-bold text-slate-700 hover:bg-slate-300"
          >
            −
          </button>
          <button
            onClick={incrementarPacientes}
            className="h-9 w-9 rounded-lg bg-slate-200 font-bold text-slate-700 hover:bg-slate-300"
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
}