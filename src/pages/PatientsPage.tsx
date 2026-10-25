import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { pacienteSchema, type PacienteFormData } from '@/schemas/pacienteSchema';
import { extraerMensajeError } from '@/lib/errorHandler';
import ModalConfirmacion from '@/components/ModalConfimacion';
import { usePacientesStore } from '@/stores/pacientesStore';
import { useFiltrosStore } from '@/stores/filtrosStore';
import type { PacienteApi } from '@/types/api';

const valoresIniciales: PacienteFormData = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  direccion: '',
};

export default function PaginaPacientes() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);
  const cargar = usePacientesStore((s) => s.cargar);
  const crear = usePacientesStore((s) => s.crear);
  const eliminar = usePacientesStore((s) => s.eliminar);


  const query = useFiltrosStore((s) => s.queryPacientes);
  const setQuery = useFiltrosStore((s) => s.setQueryPacientes);

  const [aEliminar, setAEliminar] = useState<PacienteApi | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: valoresIniciales,
  });

  useEffect(() => {
    const timer = setTimeout(() => cargar(query), 300);
    return () => clearTimeout(timer);
  }, [query, cargar]);

  const onSubmit = async (data: PacienteFormData) => {
    try {
      await crear({ ...data, direccion: data.direccion?.trim() ? data.direccion : null });
      toast.success('Paciente registrado');
      reset(valoresIniciales);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  const confirmarEliminar = async () => {
    if (!aEliminar) return;
    setEliminando(true);
    try {
      await eliminar(aEliminar.id);
      toast.success('Paciente eliminado');
      setAEliminar(null);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  };

  const claseCampo = (tieneError: boolean) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      tieneError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-teal-500'
    }`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2"
      >
        <h2 className="text-lg font-semibold text-slate-800 sm:col-span-2">Registrar paciente</h2>
        {(
          [
            ['nombre', 'Nombre', 'text'],
            ['apellido', 'Apellido', 'text'],
            ['email', 'Email', 'email'],
            ['telefono', 'Teléfono (9 dígitos)', 'tel'],
            ['fechaNacimiento', 'Fecha de nacimiento', 'date'],
            ['direccion', 'Dirección (opcional)', 'text'],
          ] as const
        ).map(([campo, label, tipo]) => (
          <div key={campo}>
            <label htmlFor={campo} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
            <input id={campo} type={tipo} {...register(campo)} className={claseCampo(!!errors[campo])} />
            {errors[campo] && <p className="mt-1 text-sm text-rose-600">{errors[campo]?.message}</p>}
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
        >
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nombre, apellido o email..."
        className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      {cargando ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="font-medium text-rose-700">No se pudieron cargar los pacientes: {error}</p>
          <button
            type="button"
            onClick={() => cargar(query)}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500">{pacientes.length} paciente(s) registrado(s)</p>
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            {pacientes.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-slate-800">{p.nombre} {p.apellido}</p>
                  <p className="text-sm text-slate-500">{p.email} · {p.telefono}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/pacientes/${p.id}`} className="rounded-lg px-3 py-1 text-sm font-medium text-teal-700 hover:bg-teal-50">
                    Ver detalle →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAEliminar(p)}
                    className="rounded-lg px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo="Eliminar paciente"
        mensaje={`¿Seguro que quieres eliminar a ${aEliminar?.nombre} ${aEliminar?.apellido}? Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  );
}