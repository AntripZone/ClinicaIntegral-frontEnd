import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  fullscreen?: boolean;
  etiqueta?: string;
}

export default function Spinner({ fullscreen = false, etiqueta = 'Cargando' }: SpinnerProps) {
  if (fullscreen) {
    return (
      <div role="status" className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" aria-hidden="true" />
        <span className="sr-only">{etiqueta}</span>
      </div>
    );
  }

  return (
    <span role="status" className="inline-block h-4 w-4">
      <Loader2 className="h-4 w-4 animate-spin text-teal-600" aria-hidden="true" />
      <span className="sr-only">{etiqueta}</span>
    </span>
  );
}