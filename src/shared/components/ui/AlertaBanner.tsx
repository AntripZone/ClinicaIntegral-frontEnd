import { AlertTriangle, CheckCircle2, Info, XCircle, type LucideIcon } from 'lucide-react';

type TipoAlerta = 'info' | 'exito' | 'advertencia' | 'error';

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  titulo?: string;
  accion?: { label: string; onClick: () => void };
}

const estilos: Record<TipoAlerta, { clases: string; boton: string; icono: LucideIcon }> = {
  info: { clases: 'border-sky-200 bg-sky-50 text-sky-800', boton: 'bg-sky-600 hover:bg-sky-700', icono: Info },
  exito: { clases: 'border-emerald-200 bg-emerald-50 text-emerald-800', boton: 'bg-emerald-600 hover:bg-emerald-700', icono: CheckCircle2 },
  advertencia: { clases: 'border-amber-200 bg-amber-50 text-amber-800', boton: 'bg-amber-600 hover:bg-amber-700', icono: AlertTriangle },
  error: { clases: 'border-rose-200 bg-rose-50 text-rose-800', boton: 'bg-rose-600 hover:bg-rose-700', icono: XCircle },
};

export default function AlertaBanner({ tipo, mensaje, titulo, accion }: AlertaBannerProps) {
  const { clases, boton, icono: Icono } = estilos[tipo];
  const urgente = tipo === 'error' || tipo === 'advertencia';

  return (
    <div
      role={urgente ? 'alert' : 'status'}
      className={`flex flex-wrap items-start gap-3 rounded-xl border p-4 ${clases}`}
    >
      <Icono className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        <p className="text-sm">{mensaje}</p>
      </div>
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold text-white ${boton}`}
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}