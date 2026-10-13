import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Doctor = {
  id: string;
  full_name: string;
  specialty: string;
  email: string;
  phone: string | null;
  bio: string | null;
  status: "active" | "on_leave" | "inactive";
  created_at: string;
};

export type Patient = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  address: string | null;
  blood_type: string | null;
  notes: string | null;
  status: "active" | "inactive";
  created_at: string;
};

export type Appointment = {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  reason: string | null;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes: string | null;
  created_at: string;
  patient?: Patient;
  doctor?: Doctor;
};

export type Profile = {
  id: string;
  full_name: string;
  role: "admin" | "staff" | "doctor";
  created_at: string;
};

export type AppointmentInput = {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  reason?: string | null;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string | null;
};

export type DoctorInput = {
  full_name: string;
  specialty: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  status?: "active" | "on_leave" | "inactive";
};

export type PatientInput = {
  full_name: string;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  gender?: "male" | "female" | "other" | null;
  address?: string | null;
  blood_type?: string | null;
  notes?: string | null;
  status?: "active" | "inactive";
};
