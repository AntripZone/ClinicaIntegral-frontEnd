import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as citasService from '@/services/citas';
import { extraerMensajeError } from '@/lib/errorHandler';
import type { CitaApi, EstadoCita, RespuestaPaginada } from '@/types/api';
import { AlertaBanner, EstadoVacio, SkeletonCitaRow, ALTO_FILA_CITA } from '@/shared/components/ui';

// Valores legibles en la URL: ?estado=Completada
const ESTADOS_FILTRO = ['Todos', 'Programada', 'Completada', 'Cancelada'] as const;
type EstadoFiltro = (typeof ESTADOS_FILTRO)[number];

const LIMITE = 10;

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

function esEstadoFiltro(valor: string | null): valor is EstadoFiltro {
  return ESTADOS_FILTRO.includes(valor as EstadoFiltro);
}

export default function PaginaHistorialCitas() {
  const [searchParams, setSearchParams] = useSearchParams();


  const pagina = Math.max(1, Number(searchParams.get('pagina')) || 1);
  const estadoParam = searchParams.get('estado');
  const estado: EstadoFiltro = esEstadoFiltro(estadoParam) ? estadoParam : 'Todos';

  const [respuesta, setRespuesta] = useState<RespuestaPaginada<CitaApi> | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const cargarCitas = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await citasService.getHistorial({
          pagina,
          limite: LIMITE,
          estado: estado === 'Todos' ? undefined : (estado.toUpperCase() as EstadoCita),
          signal: controller.signal,
        });
        setRespuesta(res.data);
      } catch (err) {
        if (controller.signal.aborted) return; // petición vieja cancelada: se ignora
        setError(extraerMensajeError(err));
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargarCitas();
    return () => controller.abort();
  }, [pagina, estado, intento]);

  const handleCambiarEstado = (nuevoEstado: EstadoFiltro) => {
    setSearchParams({ pagina: '1', estado: nuevoEstado });
  };

  const irAPagina = (nuevaPagina: number) => {
    setSearchParams({ pagina: String(nuevaPagina), estado });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPaginas = respuesta?.totalPaginas ?? 1;
  const total = respuesta?.total ?? 0;
  const citas = respuesta?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Historial de citas</h1>
        <select
          value={estado}
          onChange={(e) => handleCambiarEstado(e.target.value as EstadoFiltro)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {ESTADOS_FILTRO.map((e) => (
            <option key={e} value={e}>{e === 'Todos' ? 'Todos los estados' : e}</option>
          ))}
        </select>
      </div>

      {error ? (
        <AlertaBanner
          tipo="error"
          titulo="No se pudo cargar el historial"
          mensaje={error}
          accion={{ label: 'Reintentar', onClick: () => setIntento((n) => n + 1) }}
        />
      ) : (
        <>
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
            {cargando ? (
              Array.from({ length: LIMITE }, (_, i) => <SkeletonCitaRow key={i} />)
            ) : citas.length === 0 ? (
              <li>
                <EstadoVacio
                  titulo={pagina > totalPaginas ? 'Esta página no existe' : 'No hay citas con este filtro'}
                  accion={
                    pagina > totalPaginas
                      ? { label: 'Ir a la página 1', onClick: () => irAPagina(1) }
                      : estado !== 'Todos'
                        ? { label: 'Ver todos los estados', onClick: () => handleCambiarEstado('Todos') }
                        : undefined
                  }
                />
              </li>
            ) : (
              citas.map((c) => (
                <li key={c.id} className={`flex ${ALTO_FILA_CITA} items-center justify-between gap-3 px-4`}>
                  <div className="min-w-0">
                    <Link
                      to={`/pacientes/${c.paciente.id}`}
                      className="truncate font-medium text-slate-800 hover:text-teal-700"
                    >
                      {c.paciente.nombre} {c.paciente.apellido}
                    </Link>
                    <p className="truncate text-sm text-slate-500">
                      Dr(a). {c.medico.nombre} {c.medico.apellido} ·{' '}
                      {new Date(c.fechaHora).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${estiloPorEstado[c.estado]}`}>
                    {etiquetaPorEstado[c.estado]}
                  </span>
                </li>
              ))
            )}
          </ul>

          {/* Controles de paginación */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => irAPagina(pagina - 1)}
              disabled={cargando || pagina <= 1}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Anterior
            </button>

            <p className="text-sm text-slate-500">
              Página {pagina} de {totalPaginas} — {total} registros
            </p>

            <button
              type="button"
              onClick={() => irAPagina(pagina + 1)}
              disabled={cargando || pagina >= totalPaginas}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}