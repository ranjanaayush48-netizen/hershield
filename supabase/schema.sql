-- ==============================================================================
-- HerShield Production Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  custom_sos_message TEXT DEFAULT 'EMERGENCY: I need urgent assistance. My live coordinates are attached.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can view and edit their own profile" ON public.profiles;
EXCEPTION WHEN undefined_object THEN END $$;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- 1b. Profile Security (Backend Only)
CREATE TABLE IF NOT EXISTS public.profile_security (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  emergency_pin_hash TEXT
);

ALTER TABLE public.profile_security ENABLE ROW LEVEL SECURITY;

-- Deny all normal client access. The backend admin key bypasses RLS.
REVOKE ALL ON public.profile_security FROM anon, authenticated;
-- Just to be absolutely safe, no policies are created, which defaults to deny all.

-- 2. Trusted Contacts Table
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT DEFAULT 'Friend',
  phone TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_emergency BOOLEAN DEFAULT true,
  notify_on_sos BOOLEAN DEFAULT true,
  notify_on_location_share BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can manage their own trusted contacts" ON public.trusted_contacts;
  DROP POLICY IF EXISTS "Users can view their own trusted contacts" ON public.trusted_contacts;
  DROP POLICY IF EXISTS "Users can insert their own trusted contacts" ON public.trusted_contacts;
  DROP POLICY IF EXISTS "Users can update their own trusted contacts" ON public.trusted_contacts;
  DROP POLICY IF EXISTS "Users can delete their own trusted contacts" ON public.trusted_contacts;
EXCEPTION WHEN undefined_object THEN END $$;

CREATE POLICY "Users can view their own trusted contacts"
  ON public.trusted_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trusted contacts"
  ON public.trusted_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trusted contacts"
  ON public.trusted_contacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trusted contacts"
  ON public.trusted_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- 3. SOS Events Table
CREATE TABLE IF NOT EXISTS public.sos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION DEFAULT 10,
  address TEXT,
  status TEXT CHECK (status IN ('active', 'resolved', 'cancelled')) DEFAULT 'active',
  contacts_notified_count INTEGER DEFAULT 0,
  delivery_status JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.sos_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view and manage their own SOS events" ON public.sos_events;
  DROP POLICY IF EXISTS "Users can view their own SOS events" ON public.sos_events;
  DROP POLICY IF EXISTS "Users can insert their own SOS events" ON public.sos_events;
  DROP POLICY IF EXISTS "Users can update their own SOS events" ON public.sos_events;
  DROP POLICY IF EXISTS "Users can delete their own SOS events" ON public.sos_events;
EXCEPTION WHEN undefined_object THEN END $$;

CREATE POLICY "Users can view their own SOS events"
  ON public.sos_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SOS events"
  ON public.sos_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SOS events"
  ON public.sos_events FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SOS events"
  ON public.sos_events FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Location Sharing Sessions Table
CREATE TABLE IF NOT EXISTS public.location_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION DEFAULT 10,
  address TEXT,
  duration_minutes INTEGER NOT NULL,
  share_token_hash TEXT UNIQUE NOT NULL,
  shared_contact_ids UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE public.location_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Owners can manage their location sessions" ON public.location_sessions;
  DROP POLICY IF EXISTS "Active sessions readable by share token" ON public.location_sessions;
  DROP POLICY IF EXISTS "Users can view their own location sessions" ON public.location_sessions;
  DROP POLICY IF EXISTS "Users can insert their own location sessions" ON public.location_sessions;
  DROP POLICY IF EXISTS "Users can update their own location sessions" ON public.location_sessions;
  DROP POLICY IF EXISTS "Users can delete their own location sessions" ON public.location_sessions;
EXCEPTION WHEN undefined_object THEN END $$;

CREATE POLICY "Users can view their own location sessions"
  ON public.location_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own location sessions"
  ON public.location_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location sessions"
  ON public.location_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own location sessions"
  ON public.location_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Incident Reports Table
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  incident_date DATE NOT NULL,
  incident_time TEXT,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  evidence_file_path TEXT,
  evidence_file_name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('submitted', 'under_review', 'resolved')) DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view and create their own incident reports" ON public.incident_reports;
  DROP POLICY IF EXISTS "Users can view their own incident reports" ON public.incident_reports;
  DROP POLICY IF EXISTS "Users can insert their own incident reports" ON public.incident_reports;
  DROP POLICY IF EXISTS "Users can update their own incident reports" ON public.incident_reports;
  DROP POLICY IF EXISTS "Users can delete their own incident reports" ON public.incident_reports;
EXCEPTION WHEN undefined_object THEN END $$;

CREATE POLICY "Users can view their own incident reports"
  ON public.incident_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own incident reports"
  ON public.incident_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incident reports"
  ON public.incident_reports FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incident reports"
  ON public.incident_reports FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Storage bucket configuration for private evidence
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence-files', 'evidence-files', false)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can upload their own evidence files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can access their own evidence files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own evidence files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own evidence files" ON storage.objects;
EXCEPTION WHEN undefined_object THEN END $$;

CREATE POLICY "Users can upload their own evidence files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'evidence-files' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can access their own evidence files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'evidence-files' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can update their own evidence files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'evidence-files' AND auth.uid() = (storage.foldername(name))[1]::uuid);

CREATE POLICY "Users can delete their own evidence files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'evidence-files' AND auth.uid() = (storage.foldername(name))[1]::uuid);
