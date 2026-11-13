-- ================================================================
-- Klarify 2026 Supabase Database Migration
-- Multi-Track Orientation, Tech Companies & User Profiles
-- ================================================================

-- 1. Enable pg_trgm and vector extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Extend Institution Types for Tech Companies & Vocational Centers
-- Adds TECH_COMPANY and VOCATIONAL_CENTER to the institution_type enum
DO $$ 
BEGIN
    ALTER TYPE public.institution_type ADD VALUE IF NOT EXISTS 'TECH_COMPANY';
    ALTER TYPE public.institution_type ADD VALUE IF NOT EXISTS 'VOCATIONAL_CENTER';
    ALTER TYPE public.institution_type ADD VALUE IF NOT EXISTS 'BOOTCAMP';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add listing duration and flexible pricing columns to institutions
ALTER TABLE public.institutions 
ADD COLUMN IF NOT EXISTS listing_duration_months INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS contact_person_name TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'EDUCATION';

-- 3. Create Public Profiles Table (Synchronized with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    academic_level TEXT DEFAULT 'undergraduate',
    target_direction TEXT DEFAULT 'Software & Web',
    known_skills TEXT[] DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'phone', new.phone),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Create Saved Resources Table (Courses, Bootcamps & Internships)
CREATE TABLE IF NOT EXISTS public.saved_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('course', 'bootcamp', 'internship', 'book')),
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    cost TEXT,
    duration TEXT,
    url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, resource_id)
);

-- Enable RLS on Saved Resources
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved resources" ON public.saved_resources;
CREATE POLICY "Users can view own saved resources" 
ON public.saved_resources FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved resources" ON public.saved_resources;
CREATE POLICY "Users can insert own saved resources" 
ON public.saved_resources FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved resources" ON public.saved_resources;
CREATE POLICY "Users can delete own saved resources" 
ON public.saved_resources FOR DELETE USING (auth.uid() = user_id);

-- 5. Indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_saved_resources_user_id ON public.saved_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_programs_user_id ON public.saved_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_known_skills ON public.profiles USING GIN (known_skills);
