import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import type { PacienteApi } from '@/types/api';

export default function PatientsPage() {
  const [pacientes, setPacientes] = useState<PacienteApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cargarPacientes = () => {
    setCargando(true);
    setError(false);
    api.get<PacienteApi[]>('/pacientes')
      .then((res) => setPacientes(res.data)) // array plano, no res.data.data
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  };

  useEffect(cargarPacientes, []);

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        <p className="font-medium text-rose-700">No se pudieron cargar los pacientes.</p>
        <button
          type="button"
          onClick={cargarPacientes}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
        <p className="mt-1 text-sm text-slate-500">{pacientes.length} paciente(s) registrado(s)</p>
      </div>

      <input
        className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
      />

      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
        {pacientesFiltrados.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-slate-800">{p.nombre} {p.apellido}</p>
              <p className="text-sm text-slate-500">{p.email} · {p.telefono}</p>
            </div>
            <Link
              to={`/pacientes/${p.id}`}
              className="rounded-lg px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-50"
            >
              Ver detalle →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}