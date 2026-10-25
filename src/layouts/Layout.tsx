import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarPlus, Menu, X, CalendarDays, BarChart3 } from 'lucide-react';

const enlaces = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pacientes', label: 'Pacientes', icon: Users },
  { to: '/citas/nueva', label: 'Nueva cita', icon: CalendarPlus },
  { to: '/citas', label: 'Citas', icon: CalendarDays },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
];

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Fondo oscuro en móvil */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Sidebar */}
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
          {enlaces.map(({ to, label, icon: Icono }) => (
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