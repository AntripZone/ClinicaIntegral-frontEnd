import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { citaSchema, hoyISO, type CitaFormData } from '@/schemas/citaSchema';
import { useMedicos } from '@/hooks/useMedicos';
import { useApi } from '@/hooks/useApi';
import { useCitasStore } from '@/stores/citasStore';
import { extraerMensajeError } from '@/lib/errorHandler';
import type { PacienteApi, RespuestaPaginada } from '@/types/api';

const etiquetaUrgencia: Record<CitaFormData['urgencia'], string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
};

const valoresIniciales: CitaFormData = {
  pacienteId: '',
  medicoId: '',
  fecha: '',
  hora: '',
  motivo: '',
  urgencia: 'baja',
};

export default function FormularioCita() {
  const { medicos, cargando: cargandoMedicos } = useMedicos();
  const pacientesApi = useApi<RespuestaPaginada<PacienteApi>>('/pacientes?limite=100');
  const pacientes = pacientesApi.data?.data ?? [];

  const agregarCita = useCitasStore((s) => s.agregarCita);
  const [citaConfirmada, setCitaConfirmada] = useState<CitaFormData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: valoresIniciales,
  });

  const onSubmit = async (data: CitaFormData) => {
    try {
      const fechaHora = new Date(`${data.fecha}T${data.hora}`).toISOString();

      await agregarCita({
        pacienteId: Number(data.pacienteId),
        medicoId: Number(data.medicoId),
        fechaHora,
        motivo: data.motivo,
        notas: `Urgencia: ${etiquetaUrgencia[data.urgencia]}`,
      });

      toast.success('Cita agendada');
      setCitaConfirmada(data);
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  const agendarOtra = () => {
    reset(valoresIniciales);
    setCitaConfirmada(null);
  };

  const claseCampo = (tieneError: boolean) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      tieneError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-teal-500'
    }`;

  if (citaConfirmada) {
    const medico = medicos.find((m) => String(m.id) === citaConfirmada.medicoId);
    const paciente = pacientes.find((p) => String(p.id) === citaConfirmada.pacienteId);

    return (
      <div className="max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-emerald-800">✅ Cita agendada</h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="font-medium text-slate-600">Paciente</dt>
          <dd className="text-slate-800">{paciente ? `${paciente.nombre} ${paciente.apellido}` : '—'}</dd>
          <dt className="font-medium text-slate-600">Médico</dt>
          <dd className="text-slate-800">{medico ? `${medico.nombre} ${medico.apellido}` : '—'}</dd>
          <dt className="font-medium text-slate-600">Fecha</dt>
          <dd className="text-slate-800">{citaConfirmada.fecha}</dd>
          <dt className="font-medium text-slate-600">Hora</dt>
          <dd className="text-slate-800">{citaConfirmada.hora}</dd>
          <dt className="font-medium text-slate-600">Urgencia</dt>
          <dd className="text-slate-800">{etiquetaUrgencia[citaConfirmada.urgencia]}</dd>
          <dt className="font-medium text-slate-600">Motivo</dt>
          <dd className="text-slate-800">{citaConfirmada.motivo}</dd>
        </dl>
        <button
          type="button"
          onClick={agendarOtra}
          className="mt-6 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid max-w-2xl gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
    >
      {/* Paciente */}
      <div className="sm:col-span-2">
        <label htmlFor="pacienteId" className="mb-1 block text-sm font-medium text-slate-700">Paciente</label>
        <select id="pacienteId" {...register('pacienteId')} className={claseCampo(!!errors.pacienteId)}>
          {pacientesApi.cargando ? (
            <option disabled>Cargando pacientes...</option>
          ) : (
            <>
              <option value="">Selecciona un paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido} — {p.email}</option>
              ))}
            </>
          )}
        </select>
        {errors.pacienteId && <p className="mt-1 text-sm text-rose-600">{errors.pacienteId.message}</p>}
      </div>

      {/* Médico */}
      <div className="sm:col-span-2">
        <label htmlFor="medicoId" className="mb-1 block text-sm font-medium text-slate-700">Médico</label>
        <select id="medicoId" {...register('medicoId')} className={claseCampo(!!errors.medicoId)}>
          {cargandoMedicos ? (
            <option disabled>Cargando médicos...</option>
          ) : (
            <>
              <option value="">Selecciona un médico</option>
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>
              ))}
            </>
          )}
        </select>
        {errors.medicoId && <p className="mt-1 text-sm text-rose-600">{errors.medicoId.message}</p>}
      </div>

      {/* Fecha */}
      <div>
        <label htmlFor="fecha" className="mb-1 block text-sm font-medium text-slate-700">Fecha</label>
        <input id="fecha" type="date" min={hoyISO()} {...register('fecha')} className={claseCampo(!!errors.fecha)} />
        {errors.fecha && <p className="mt-1 text-sm text-rose-600">{errors.fecha.message}</p>}
      </div>

      {/* Hora */}
      <div>
        <label htmlFor="hora" className="mb-1 block text-sm font-medium text-slate-700">Hora</label>
        <input id="hora" type="time" {...register('hora')} className={claseCampo(!!errors.hora)} />
        {errors.hora && <p className="mt-1 text-sm text-rose-600">{errors.hora.message}</p>}
      </div>

      {/* Urgencia */}
      <div className="sm:col-span-2">
        <label htmlFor="urgencia" className="mb-1 block text-sm font-medium text-slate-700">Urgencia</label>
        <select id="urgencia" {...register('urgencia')} className={claseCampo(!!errors.urgencia)}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
      </div>

      {/* Motivo */}
      <div className="sm:col-span-2">
        <label htmlFor="motivo" className="mb-1 block text-sm font-medium text-slate-700">Motivo de la consulta</label>
        <textarea id="motivo" rows={4} {...register('motivo')} className={claseCampo(!!errors.motivo)} />
        {errors.motivo && <p className="mt-1 text-sm text-rose-600">{errors.motivo.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
      >
        {isSubmitting ? 'Agendando...' : 'Agendar cita'}
      </button>
    </form>
  );
}