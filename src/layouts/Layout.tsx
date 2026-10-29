import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarPlus, Menu, X, CalendarDays, BarChart3, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { urlArchivo } from '@/lib/urls';

const enlaces = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pacientes', label: 'Pacientes', icon: Users },
  { to: '/citas/nueva', label: 'Nueva cita', icon: CalendarPlus },
  { to: '/citas', label: 'Citas', icon: CalendarDays },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
];

export default function Layout() {
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {menuAbierto && (
       <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-bold text-slate-800 lg:hidden">MediClinic</span>
          </div>

          <div className="flex items-center gap-3">
            {usuario && (
              <Link
                to="/perfil"
                className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-100"
              >
                <div className="text-right leading-tight">
                  <p className="max-w-[12rem] truncate text-sm font-medium text-slate-800">
                    {usuario.nombre ?? usuario.email}
                  </p>
                  <p className="text-xs text-slate-500">{usuario.rol}</p>
                </div>
                {usuario.fotoUrl ? (
                  <img
                    src={urlArchivo(usuario.fotoUrl)}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                    {(usuario.nombre ?? usuario.email).charAt(0).toUpperCase()}
                  </span>
                )}
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:sticky lg:translate-x-0 ${
          menuAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="text-lg font-bold text-slate-800">🩺 MediClinic</span>
          <button
            type="button"
            onClick={() => setMenuAbierto(false)}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {enlaces
            .filter((e) => e.to !== '/reportes' || usuario?.rol == 'GERENCIA')
            .map(({ to, label, icon: Icono }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`
              }
            >
              <Icono className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-slate-800">MediClinic</span>
        </div>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}