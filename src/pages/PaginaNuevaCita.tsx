import { useNavigate } from 'react-router-dom';
import FormularioCita from '@/components/FormularioCita';

export default function PaginaNuevaCita() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Agendar cita</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
      <FormularioCita />
    </div>
  );
}