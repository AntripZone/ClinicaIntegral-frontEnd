import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import InputFotoPerfil from '@/components/InputFotoPerfil';
import { perfilSchema, type PerfilFormData } from '@/schemas/perfilSchema';
import { actualizarPerfil } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { extraerMensajeError } from '@/lib/errorHandler';
import { urlArchivo } from '@/lib/urls';

export default function PaginaPerfil() {
  const usuario = useAuthStore((s) => s.usuario);
  const actualizarUsuario = useAuthStore((s) => s.actualizarUsuario);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: usuario?.nombre ?? '',
      email: usuario?.email ?? '',
      telefono: usuario?.telefono ?? '',
    },
  });

  const onSubmit = async (datos: PerfilFormData) => {
    const formData = new FormData();
    formData.append('nombre', datos.nombre);
    formData.append('email', datos.email);
    if (datos.telefono) formData.append('telefono', datos.telefono);
    if (archivoFoto) formData.append('foto', archivoFoto);

    try {
      const usuarioActualizado = await actualizarPerfil(formData);
      actualizarUsuario(usuarioActualizado);
      setArchivoFoto(null);
      toast.success('Perfil actualizado');
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  const claseCampo = (tieneError: boolean) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      tieneError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-teal-500'
    }`;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Mi perfil</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <InputFotoPerfil fotoActual={urlArchivo(usuario?.fotoUrl)} onChange={setArchivoFoto} />

        <div>
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
          <input id="nombre" {...register('nombre')} className={claseCampo(!!errors.nombre)} />
          {errors.nombre && <p className="mt-1 text-sm text-rose-600">{errors.nombre.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input id="email" type="email" {...register('email')} className={claseCampo(!!errors.email)} />
          {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-slate-700">
            Teléfono <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <input id="telefono" type="tel" {...register('telefono')} className={claseCampo(!!errors.telefono)} />
          {errors.telefono && <p className="mt-1 text-sm text-rose-600">{errors.telefono.message}</p>}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-400">Rol: {usuario?.rol}</span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}