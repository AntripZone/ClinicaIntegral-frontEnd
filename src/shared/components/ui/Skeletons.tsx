function Linea({ alto, barra }: { alto: string; barra: string }) {
  return (
    <div className={`flex ${alto} items-center`}>
      <div className={`animate-pulse rounded bg-slate-200 ${barra}`} />
    </div>
  );
}

export function SkeletonMetricCard() {
  return (
    <div aria-hidden="true" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Linea alto="h-5" barra="h-3.5 w-24" />
        <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-2"><Linea alto="h-9" barra="h-7 w-16" /></div>
      <div className="mt-1"><Linea alto="h-5" barra="h-3 w-32" /></div>
    </div>
  );
}

export function SkeletonPacienteRow() {
  return (
    <li aria-hidden="true" className="flex items-center justify-between gap-3 p-4">
      <div>
        <Linea alto="h-6" barra="h-4 w-40" />
        <Linea alto="h-5" barra="h-3 w-56" />
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </li>
  );
}

export const ALTO_FILA_CITA = 'h-[76px]';

export function SkeletonCitaRow() {
  return (
    <li aria-hidden="true" className={`flex ${ALTO_FILA_CITA} items-center justify-between gap-3 px-4`}>
      <div>
        <Linea alto="h-6" barra="h-4 w-48" />
        <Linea alto="h-5" barra="h-3 w-64" />
      </div>
      <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
    </li>
  );
}