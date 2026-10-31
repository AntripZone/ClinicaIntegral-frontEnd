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
import { AlertaBanner, EstadoVacio, ErrorBoundary } from '@/shared/components/ui';

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
            <AlertaBanner
              tipo="error"
              mensaje={especialidades.error}
              accion={{ label: 'Reintentar', onClick: especialidades.recargar }}
            />
          ) : datosEspecialidades.length === 0 ? (
            <EstadoVacio titulo="No hay especialidades registradas" />
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
            <AlertaBanner
              tipo="error"
              mensaje={citas.error}
              accion={{ label: 'Reintentar', onClick: citas.recargar }}
              />
          ) : !hayCitasEnLaSemana ? (
            <EstadoVacio titulo="No hay especialidades registradas" />
          ) : (
            <ErrorBoundary fallback={<AlertaBanner tipo="error" mensaje="No se pudo dibujar esta gráfica." />}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosPorDia}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" name="Citas" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ErrorBoundary>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}