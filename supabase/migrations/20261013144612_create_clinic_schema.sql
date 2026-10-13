/*
# Clinic Management Dashboard Schema

1. New Tables
- `doctors` — stores doctor profiles with name, specialty, email, phone, and bio.
  - id (uuid, PK)
  - full_name (text, not null)
  - specialty (text, not null)
  - email (text, unique, not null)
  - phone (text)
  - bio (text)
  - status (text, default 'active') — 'active' | 'on_leave' | 'inactive'
  - created_at (timestamptz, default now())
- `patients` — stores patient records with personal and contact info.
  - id (uuid, PK)
  - full_name (text, not null)
  - email (text)
  - phone (text)
  - date_of_birth (date)
  - gender (text) — 'male' | 'female' | 'other'
  - address (text)
  - blood_type (text)
  - notes (text)
  - status (text, default 'active') — 'active' | 'inactive'
  - created_at (timestamptz, default now())
- `appointments` — links patients to doctors with date/time and status.
  - id (uuid, PK)
  - patient_id (uuid, FK -> patients.id, cascade delete)
  - doctor_id (uuid, FK -> doctors.id, cascade delete)
  - appointment_date (date, not null)
  - appointment_time (time, not null)
  - duration_minutes (int, default 30)
  - reason (text)
  - status (text, default 'scheduled') — 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  - notes (text)
  - created_at (timestamptz, default now())
- `profiles` — extends auth.users with role info for the dashboard users.
  - id (uuid, PK, FK -> auth.users.id, cascade delete)
  - full_name (text, not null)
  - role (text, default 'admin') — 'admin' | 'staff' | 'doctor'
  - created_at (timestamptz, default now())

2. Security — RLS
- All tables have RLS enabled.
- `profiles`: owner-scoped — users can read/update their own profile. Admins can read all profiles (via auth.uid check). For simplicity in this clinic dashboard, all authenticated users can read profiles (staff directory) but only update their own.
- `doctors`, `patients`, `appointments`: all authenticated users can perform CRUD (shared clinic data — all staff access the same patient/appointment pool).

3. Important Notes
- This is a multi-user app with sign-in required. All policies scope TO authenticated.
- The `profiles` table uses auth.users.id as PK so it maps 1:1 to a Supabase auth account.
- No user_id ownership columns on clinic data tables because all authenticated staff share the same pool of patients/doctors/appointments.
- Indexes added on frequently queried foreign keys and status columns.
*/

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  specialty text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  bio text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "doctors_select_authenticated" ON doctors;
CREATE POLICY "doctors_select_authenticated" ON doctors FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "doctors_insert_authenticated" ON doctors;
CREATE POLICY "doctors_insert_authenticated" ON doctors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "doctors_update_authenticated" ON doctors;
CREATE POLICY "doctors_update_authenticated" ON doctors FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "doctors_delete_authenticated" ON doctors;
CREATE POLICY "doctors_delete_authenticated" ON doctors FOR DELETE
  TO authenticated USING (true);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  address text,
  blood_type text,
  notes text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "patients_select_authenticated" ON patients;
CREATE POLICY "patients_select_authenticated" ON patients FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "patients_insert_authenticated" ON patients;
CREATE POLICY "patients_insert_authenticated" ON patients FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "patients_update_authenticated" ON patients;
CREATE POLICY "patients_update_authenticated" ON patients FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "patients_delete_authenticated" ON patients;
CREATE POLICY "patients_delete_authenticated" ON patients FOR DELETE
  TO authenticated USING (true);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes int NOT NULL DEFAULT 30,
  reason text,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "appointments_select_authenticated" ON appointments;
CREATE POLICY "appointments_select_authenticated" ON appointments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "appointments_insert_authenticated" ON appointments;
CREATE POLICY "appointments_insert_authenticated" ON appointments FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "appointments_update_authenticated" ON appointments;
CREATE POLICY "appointments_update_authenticated" ON appointments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "appointments_delete_authenticated" ON appointments;
CREATE POLICY "appointments_delete_authenticated" ON appointments FOR DELETE
  TO authenticated USING (true);

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'staff',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON profiles;
CREATE POLICY "profiles_select_authenticated" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors(status);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
