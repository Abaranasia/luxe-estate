-- Create role enum
CREATE TYPE user_role AS ENUM ('admin', 'broker', 'agent', 'viewer');

-- Profiles table extends auth.users with role management
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT,
  full_name    TEXT,
  avatar_url   TEXT,
  role         user_role NOT NULL DEFAULT 'viewer',
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Each authenticated user can read their own profile row
CREATE POLICY "user_select_own"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Admins can read all profile rows
CREATE POLICY "admin_select_all"
  ON profiles FOR SELECT TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Authenticated users can insert their own profile row (needed for the
-- post-login upsert that covers users who existed before this migration)
CREATE POLICY "user_insert_own"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Only admins can update roles and suspended flag
CREATE POLICY "admin_update_all"
  ON profiles FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Auto-create a profile row whenever a new user signs up via OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Keep updated_at current on every row update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- MANUAL BOOTSTRAP (run once in the Supabase SQL editor after
-- applying this migration and signing in for the first time):
--
--   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ────────────────────────────────────────────────────────────
