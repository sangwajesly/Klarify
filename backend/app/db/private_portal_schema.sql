-- ================================================================
-- Private University Partner Portal Schema & Row Level Security
-- ================================================================

-- 1. Custom Enums
DO $$ BEGIN
    CREATE TYPE public.institution_type AS ENUM ('PUBLIC_STATE', 'PRIVATE_IPES', 'CONFESSIONAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.verification_status AS ENUM ('PENDING', 'VERIFIED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Institutions Table
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type public.institution_type DEFAULT 'PRIVATE_IPES',
    verification_status public.verification_status DEFAULT 'PENDING',
    city TEXT NOT NULL,
    campus TEXT,
    logo_url TEXT,
    website_url TEXT,
    whatsapp_number TEXT NOT NULL,
    admissions_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Institution Members Table (Links auth.users to Institutions)
CREATE TABLE IF NOT EXISTS public.institution_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'INSTITUTION_ADMIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, institution_id)
);

-- 4. Extend Programs Table to support Private University Attributes
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS campus TEXT,
ADD COLUMN IF NOT EXISTS degree_obtained TEXT,
ADD COLUMN IF NOT EXISTS tuition_fee_xaf NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admission_deadline DATE;

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;

-- Public can read institutions
DROP POLICY IF EXISTS "Public can view institutions" ON public.institutions;
CREATE POLICY "Public can view institutions" ON public.institutions FOR SELECT USING (true);

-- Authenticated users can insert their institution upon signup
DROP POLICY IF EXISTS "Authenticated users can create institution" ON public.institutions;
CREATE POLICY "Authenticated users can create institution" ON public.institutions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Institution admins can update their institution profile
DROP POLICY IF EXISTS "Uni admins can update own institution" ON public.institutions;
CREATE POLICY "Uni admins can update own institution" ON public.institutions FOR UPDATE USING (
    id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);

-- Members policies
DROP POLICY IF EXISTS "Members can view own membership" ON public.institution_members;
CREATE POLICY "Members can view own membership" ON public.institution_members FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users can create membership" ON public.institution_members;
CREATE POLICY "Users can create membership" ON public.institution_members FOR INSERT WITH CHECK (user_id = auth.uid());

-- Program RLS Policies for University Admins
DROP POLICY IF EXISTS "Uni admins can insert programs" ON public.programs;
CREATE POLICY "Uni admins can insert programs" ON public.programs FOR INSERT WITH CHECK (
    institution_id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Uni admins can update own programs" ON public.programs;
CREATE POLICY "Uni admins can update own programs" ON public.programs FOR UPDATE USING (
    institution_id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Uni admins can delete own programs" ON public.programs;
CREATE POLICY "Uni admins can delete own programs" ON public.programs FOR DELETE USING (
    institution_id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);

-- Allow university admins to SELECT their own programs (even if not approved yet)
DROP POLICY IF EXISTS "Uni admins can select own programs" ON public.programs;
CREATE POLICY "Uni admins can select own programs" ON public.programs FOR SELECT USING (
    institution_id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);
