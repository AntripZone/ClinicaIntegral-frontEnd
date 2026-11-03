import { Moon, Sun } from 'lucide-react';
import { useTemaStore } from '@/stores/temaStore';

export default function BotonTema() {
  const tema = useTemaStore((s) => s.tema);
  const alternarTema = useTemaStore((s) => s.alternarTema);
  const oscuro = tema === 'oscuro';
  const etiqueta = oscuro ? 'Activar tema claro' : 'Activar tema oscuro';

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={etiqueta}
      title={etiqueta}
      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {oscuro ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}