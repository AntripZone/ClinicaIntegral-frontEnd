import { useMemo, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApi } from '@/hooks/useApi';
import type { CitaApi, CitasPorEspecialidad } from '@/types/api';

function fechaLocal(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function ultimos7Dias(): Date[] {
  const hoy = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - (6 - i));
    return d;
  });
}

function Skeleton() {
  return <div className="h-[300px] w-full animate-pulse rounded-xl bg-slate-100" />;
}

function Vacio({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
      {mensaje}
    </div>
  );
}

function ErrorCarga({ mensaje, onReintentar }: { mensaje: string; onReintentar: () => void }) {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-3 rounded-xl bg-rose-50 text-sm text-rose-700">
      <p>{mensaje}</p>
      <button
        type="button"
        onClick={onReintentar}
        className="rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700"
      >
        Reintentar
      </button>
    </div>
  );
}

function Tarjeta({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{titulo}</h2>
      {children}
    </section>
  );
}

export default function PaginaReportes() {
  const especialidades = useApi<CitasPorEspecialidad[]>('/reportes/especialidades');
  const citas = useApi<CitaApi[]>('/citas');

  const datosPorDia = useMemo(() => {
    const dias = ultimos7Dias();
    const conteo = new Map<string, number>(dias.map((d) => [fechaLocal(d), 0]));

    for (const cita of citas.data ?? []) {
      const clave = fechaLocal(new Date(cita.fechaHora));
      if (conteo.has(clave)) conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
    }

    return dias.map((d) => ({
      dia: d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' }),
      total: conteo.get(fechaLocal(d)) ?? 0,
    }));
  }, [citas.data]);

  const hayCitasEnLaSemana = datosPorDia.some((d) => d.total > 0);
  const datosEspecialidades = especialidades.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Reportes</h1>

      <div className="grid gap-6 xl:grid-cols-2">
        <Tarjeta titulo="Citas por especialidad">
          {especialidades.cargando ? (
            <Skeleton />
          ) : especialidades.error ? (
            <ErrorCarga mensaje={especialidades.error} onReintentar={especialidades.recargar} />
          ) : datosEspecialidades.length === 0 ? (
            <Vacio mensaje="No hay especialidades registradas" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosEspecialidades}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="especialidad" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" name="Citas" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Tarjeta>

        <Tarjeta titulo="Citas por día (últimos 7 días)">
          {citas.cargando ? (
            <Skeleton />
          ) : citas.error ? (
            <ErrorCarga mensaje={citas.error} onReintentar={citas.recargar} />
          ) : !hayCitasEnLaSemana ? (
            <Vacio mensaje="No hay citas en los últimos 7 días" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosPorDia}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" name="Citas" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}