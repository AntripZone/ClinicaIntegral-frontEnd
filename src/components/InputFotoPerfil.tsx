import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { Camera, UserRound } from 'lucide-react';

interface InputFotoPerfilProps {
  fotoActual?: string;
  onChange: (archivo: File | null) => void;
}

const MAX_BYTES = 5 * 1024 * 1024;

export default function InputFotoPerfil({ fotoActual, onChange }: InputFotoPerfilProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSeleccion = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }
    if (archivo.size > MAX_BYTES) {
      toast.error('La imagen no puede superar los 5MB');
      return;
    }

    setPreview(URL.createObjectURL(archivo));
    onChange(archivo);
  };

  const src = preview ?? fotoActual;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative h-24 w-24 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        aria-label="Cambiar foto de perfil"
      >
        {src ? (
          <img src={src} alt="Foto de perfil" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="mx-auto h-12 w-12 text-slate-400" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white" />
        </span>
      </button>

      <div className="text-sm">
        <p className="font-medium text-slate-700">Foto de perfil</p>
        <p className="text-slate-500">JPG, PNG o WebP. Máximo 5 MB.</p>
        {preview && <p className="mt-1 text-teal-700">Se subirá al guardar.</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSeleccion}
        className="hidden"
      />
    </div>
  );
}