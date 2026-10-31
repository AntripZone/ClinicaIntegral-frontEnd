import { Inbox, type LucideIcon } from 'lucide-react';

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  icono?: LucideIcon;
  accion?: { label: string; onClick: () => void };
}

export default function EstadoVacio({ titulo, descripcion, icono: Icono = Inbox, accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <Icono className="h-10 w-10 text-slate-300" aria-hidden="true" />
      <p className="mt-3 font-medium text-slate-700">{titulo}</p>
      {descripcion && <p className="mt-1 max-w-sm text-sm text-slate-500">{descripcion}</p>}
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}