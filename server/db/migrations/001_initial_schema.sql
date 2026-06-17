-- Campus Code Labs — Supabase PostgreSQL schema
-- Run in Supabase SQL Editor when migrating from MongoDB

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('admin'), ('student') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  college_name VARCHAR(255) NOT NULL,
  branch VARCHAR(100),
  year VARCHAR(50),
  password_hash TEXT NOT NULL,
  role_id INT REFERENCES roles(id) DEFAULT 2,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  duration VARCHAR(50) NOT NULL,
  fee NUMERIC(10,2) NOT NULL,
  skills TEXT[],
  projects_included TEXT[],
  notes_included TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  college_name VARCHAR(255) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  year VARCHAR(50) NOT NULL,
  internship_id UUID REFERENCES internships(id),
  duration VARCHAR(50) NOT NULL,
  resume_url TEXT,
  status VARCHAR(30) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  user_id UUID REFERENCES users(id),
  internship_id UUID,
  amount NUMERIC(10,2) NOT NULL,
  utr_number VARCHAR(100),
  screenshot_url TEXT,
  status VARCHAR(30) DEFAULT 'pending',
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  internship_id UUID REFERENCES internships(id) NOT NULL,
  application_id UUID REFERENCES applications(id),
  internship_code VARCHAR(50) UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(30) DEFAULT 'active',
  offer_letter_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  file_url TEXT,
  link_url TEXT,
  internship_id UUID REFERENCES internships(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  internship_id UUID REFERENCES internships(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  project_id UUID REFERENCES projects(id) NOT NULL,
  github_url TEXT,
  live_url TEXT,
  description TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id VARCHAR(50) UNIQUE NOT NULL,
  enrollment_id UUID REFERENCES enrollments(id) NOT NULL,
  file_url TEXT,
  qr_code_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS recommendation_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) NOT NULL,
  file_url TEXT,
  status VARCHAR(30) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  issued_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS payment_settings (
  id SERIAL PRIMARY KEY,
  upi_id VARCHAR(100),
  qr_code_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supabase Storage buckets (create in dashboard or via API):
-- resumes, payments, certificates, offer-letters, notes (all private)
