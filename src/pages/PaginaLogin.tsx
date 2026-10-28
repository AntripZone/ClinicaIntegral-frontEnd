import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/schemas/loginSchema';
import { login } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { extraerMensajeError } from '@/lib/errorHandler';

export default function PaginaLogin() {
  const setAuth = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    if (isAuthenticated) return <Navigate to="/" replace />;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (datos: LoginFormData) => {
    try {
      const { token, usuario } = await login(datos);
      setAuth(token, usuario);
      toast.success('Bienvenido');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(extraerMensajeError(err));
    }
  };

  const claseCampo = (tieneError: boolean) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      tieneError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-teal-500'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-center text-2xl font-bold text-slate-800">🩺 MediClinic</h1>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input id="email" type="email" autoComplete="email" {...register('email')} className={claseCampo(!!errors.email)} />
          {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" {...register('password')} className={claseCampo(!!errors.password)} />
          {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}