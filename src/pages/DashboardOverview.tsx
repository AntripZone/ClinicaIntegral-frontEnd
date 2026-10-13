import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Appointment } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';
import {
  Users,
  CalendarDays,
  Stethoscope,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  UserX,
  ArrowUpRight,
} from 'lucide-react';

type Stats = {
  totalPatients: number;
  totalDoctors: number;
  activeDoctors: number;
  todayAppointments: number;
  upcomingAppointments: Appointment[];
  scheduledCount: number;
  completedCount: number;
  cancelledCount: number;
};

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0];

      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact', head: true }),
        supabase.from('doctors').select('id, status', { count: 'exact' }),
        supabase
          .from('appointments')
          .select('*, patient:patients(*), doctor:doctors(*)')
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true }),
      ]);

      const allAppointments = (appointmentsRes.data ?? []) as Appointment[];
      const todayAppts = allAppointments.filter((a) => a.appointment_date === today);
      const upcoming = todayAppts.filter((a) => a.status === 'scheduled').slice(0, 5);
      const doctors = doctorsRes.data ?? [];
      const activeDoctors = doctors.filter((d: { status: string }) => d.status === 'active').length;

      setStats({
        totalPatients: patientsRes.count ?? 0,
        totalDoctors: doctorsRes.count ?? 0,
        activeDoctors,
        todayAppointments: todayAppts.length,
        upcomingAppointments: upcoming,
        scheduledCount: allAppointments.filter((a) => a.status === 'scheduled').length,
        completedCount: allAppointments.filter((a) => a.status === 'completed').length,
        cancelledCount: allAppointments.filter((a) => a.status === 'cancelled').length,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Patients',
      value: stats?.totalPatients ?? 0,
      icon: Users,
      to: '/dashboard/patients',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Doctors',
      value: stats?.totalDoctors ?? 0,
      icon: Stethoscope,
      to: '/dashboard/doctors',
      color: 'bg-teal-50 text-teal-600',
    },
    {
      label: "Today's Appointments",
      value: stats?.todayAppointments ?? 0,
      icon: CalendarDays,
      to: '/dashboard/appointments',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Active Doctors',
      value: stats?.activeDoctors ?? 0,
      icon: TrendingUp,
      to: '/dashboard/doctors',
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const appointmentStats = [
    { label: 'Scheduled', value: stats?.scheduledCount ?? 0, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Completed', value: stats?.completedCount ?? 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Cancelled', value: stats?.cancelledCount ?? 0, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        subtitle="A snapshot of your clinic's activity today."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            <p className="text-slate-500 text-sm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">Today's Appointments</h2>
            <Link
              to="/dashboard/appointments"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View all
            </Link>
          </div>

          {stats?.upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-400">No appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {apt.patient?.full_name ?? 'Unknown patient'}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {apt.doctor?.full_name ?? 'Unknown doctor'} — {apt.doctor?.specialty}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {apt.appointment_time.slice(0, 5)}
                    </p>
                    <p className="text-xs text-slate-400">{apt.duration_minutes}min</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointment status breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-5">Appointment Status</h2>
          <div className="space-y-4">
            {appointmentStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-400">
              <UserX className="w-4 h-4" />
              <span className="text-sm">
                {stats?.todayAppointments ?? 0} total appointments today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
