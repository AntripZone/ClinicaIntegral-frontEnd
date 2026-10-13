import { useEffect, useState, type FormEvent } from 'react';
import { supabase, type Appointment, type Doctor, type Patient, type AppointmentInput } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CalendarDays,
  Loader2,
  Clock,
  User,
  Stethoscope,
  Filter,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  scheduled: { label: 'Scheduled', className: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  no_show: { label: 'No Show', className: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
};

const emptyForm: AppointmentInput = {
  patient_id: '',
  doctor_id: '',
  appointment_date: new Date().toISOString().split('T')[0],
  appointment_time: '09:00',
  duration_minutes: 30,
  reason: '',
  status: 'scheduled',
  notes: '',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form, setForm] = useState<AppointmentInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  async function loadAll() {
    setLoading(true);
    const [aptRes, docRes, patRes] = await Promise.all([
      supabase
        .from('appointments')
        .select('*, patient:patients(*), doctor:doctors(*)')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: true }),
      supabase.from('doctors').select('*').order('full_name'),
      supabase.from('patients').select('*').order('full_name'),
    ]);

    setAppointments((aptRes.data ?? []) as Appointment[]);
    setDoctors((docRes.data ?? []) as Doctor[]);
    setPatients((patRes.data ?? []) as Patient[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(apt: Appointment) {
    setEditing(apt);
    setForm({
      patient_id: apt.patient_id,
      doctor_id: apt.doctor_id,
      appointment_date: apt.appointment_date,
      appointment_time: apt.appointment_time.slice(0, 5),
      duration_minutes: apt.duration_minutes,
      reason: apt.reason ?? '',
      status: apt.status,
      notes: apt.notes ?? '',
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!form.patient_id || !form.doctor_id) {
      setError('Please select both a patient and a doctor.');
      setSaving(false);
      return;
    }

    const payload: AppointmentInput = {
      ...form,
      reason: form.reason?.trim() || null,
      notes: form.notes?.trim() || null,
    };

    if (editing) {
      const { error } = await supabase.from('appointments').update(payload).eq('id', editing.id);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from('appointments').insert(payload);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setModalOpen(false);
    loadAll();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('appointments').delete().eq('id', deleteTarget.id);
    if (error) {
      setError(error.message);
    } else {
      setDeleteTarget(null);
      loadAll();
    }
  }

  async function quickStatusChange(apt: Appointment, newStatus: Appointment['status']) {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', apt.id);
    if (error) {
      setError(error.message);
    } else {
      loadAll();
    }
  }

  const filtered = appointments.filter((a) => {
    const matchSearch =
      (a.patient?.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (a.doctor?.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (a.reason ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle={`${appointments.length} appointment${appointments.length !== 1 ? 's' : ''} total`}
        action={
          <button
            onClick={openCreate}
            disabled={patients.length === 0 || doctors.length === 0}
            title={
              patients.length === 0 || doctors.length === 0
                ? 'Add a patient and a doctor first'
                : ''
            }
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient, doctor, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-11 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      ) : patients.length === 0 || doctors.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <CalendarDays className="w-10 h-10 text-blue-300 mx-auto mb-2" />
          <p className="text-blue-700 text-sm">
            You need at least one patient and one doctor before creating appointments.
            Go to the Patients and Doctors pages to add them.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <CalendarDays className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">
            {search || statusFilter !== 'all'
              ? 'No appointments match your filters.'
              : 'No appointments yet. Schedule your first one!'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {/* Table on desktop */}
          <table className="hidden md:table w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Patient</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Doctor</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Date & Time</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Reason</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-800">{apt.patient?.full_name ?? 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                      <div>
                        <p className="text-sm text-slate-800">{apt.doctor?.full_name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{apt.doctor?.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{formatDate(apt.appointment_date)}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {apt.appointment_time.slice(0, 5)} ({apt.duration_minutes}min)
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {apt.reason || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={apt.status}
                      onChange={(e) => quickStatusChange(apt, e.target.value as Appointment['status'])}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-teal-400 ${statusConfig[apt.status].className}`}
                    >
                      {Object.entries(statusConfig).map(([key, cfg]) => (
                        <option key={key} value={key}>{cfg.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => openEdit(apt)}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(apt)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cards on mobile */}
          <div className="md:hidden divide-y divide-slate-50">
            {filtered.map((apt) => (
              <div key={apt.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{apt.patient?.full_name ?? 'Unknown'}</p>
                    <p className="text-sm text-teal-600">{apt.doctor?.full_name ?? 'Unknown'} — {apt.doctor?.specialty}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[apt.status].className}`}>
                    {statusConfig[apt.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {formatDate(apt.appointment_date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {apt.appointment_time.slice(0, 5)}
                  </span>
                </div>
                {apt.reason && <p className="text-sm text-slate-600 mb-3">{apt.reason}</p>}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => openEdit(apt)}
                    className="p-2 text-slate-400 hover:text-teal-600 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(apt)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Appointment' : 'New Appointment'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.patient_id}
              onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
              className={inputClass}
            >
              <option value="">Select a patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Doctor <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.doctor_id}
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
              className={inputClass}
            >
              <option value="">Select a doctor...</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.full_name} — {d.specialty}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={form.appointment_time}
                onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (min)</label>
              <select
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                className={inputClass}
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
                <option value={120}>120 min</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason for Visit</label>
            <input
              type="text"
              value={form.reason ?? ''}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className={inputClass}
              placeholder="e.g. Annual check-up, Follow-up..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as AppointmentInput['status'] })}
              className={inputClass}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={form.notes ?? ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="Any additional notes..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save Changes' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Appointment"
        message={`Are you sure you want to delete this appointment${
          deleteTarget?.patient?.full_name ? ` for ${deleteTarget.patient.full_name}` : ''
        }? This action cannot be undone.`}
      />
    </div>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all';
