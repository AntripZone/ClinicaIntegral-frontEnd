import { useEffect, useState, type FormEvent } from 'react';
import { supabase, type Doctor, type DoctorInput } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Stethoscope,
  Loader2,
  Mail,
  Phone,
  Activity,
} from 'lucide-react';

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Psychiatry',
  'General Medicine',
  'Ophthalmology',
  'Gynecology',
  'ENT',
  'Oncology',
  'Radiology',
];

const emptyForm: DoctorInput = {
  full_name: '',
  specialty: 'General Medicine',
  email: '',
  phone: '',
  bio: '',
  status: 'active',
};

const statusConfig = {
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-600' },
  on_leave: { label: 'On Leave', className: 'bg-amber-50 text-amber-600' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-500' },
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);

  async function loadDoctors() {
    setLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setDoctors((data ?? []) as Doctor[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(doctor: Doctor) {
    setEditing(doctor);
    setForm({
      full_name: doctor.full_name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone ?? '',
      bio: doctor.bio ?? '',
      status: doctor.status,
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: DoctorInput = {
      ...form,
      phone: form.phone?.trim() || null,
      bio: form.bio?.trim() || null,
    };

    if (editing) {
      const { error } = await supabase.from('doctors').update(payload).eq('id', editing.id);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from('doctors').insert(payload);
      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setModalOpen(false);
    loadDoctors();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from('doctors').delete().eq('id', deleteTarget.id);
    if (error) {
      setError(error.message);
    } else {
      setDeleteTarget(null);
      loadDoctors();
    }
  }

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (d.email ?? '').toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = filterSpecialty === 'all' || d.specialty === filterSpecialty;
    return matchSearch && matchSpecialty;
  });

  const usedSpecialties = [...new Set(doctors.map((d) => d.specialty))].sort();

  return (
    <div>
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} in your clinic`}
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-teal-600/20"
          >
            <Plus className="w-5 h-5" />
            Add Doctor
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        >
          <option value="all">All Specialties</option>
          {usedSpecialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Stethoscope className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">
            {search || filterSpecialty !== 'all'
              ? 'No doctors match your filters.'
              : 'No doctors yet. Add your first doctor!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{doctor.full_name}</h3>
                    <p className="text-sm text-teal-600 font-medium">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(doctor)}
                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(doctor)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{doctor.email}</span>
                </div>
                {doctor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {doctor.phone}
                  </div>
                )}
              </div>

              {doctor.bio && (
                <p className="text-sm text-slate-500 mt-3 line-clamp-2">{doctor.bio}</p>
              )}

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[doctor.status].className}`}
                >
                  {statusConfig[doctor.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Doctor' : 'Add New Doctor'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={inputClass}
                placeholder="Dr. Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Specialty <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className={inputClass}
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="jane@clinic.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={form.phone ?? ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'on_leave' | 'inactive' })}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea
              value={form.bio ?? ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="Brief bio about the doctor's experience and qualifications..."
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
              {editing ? 'Save Changes' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Doctor"
        message={`Are you sure you want to delete ${deleteTarget?.full_name}? This will also delete all their appointments. This action cannot be undone.`}
      />
    </div>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all';
