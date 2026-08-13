-- Enable public read access (SELECT) on programs and concours tables in Supabase
-- Run this in your Supabase SQL Editor to allow anonymous web users to query the database.

-- 1. Enable RLS on programs and concours tables if not enabled
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concours ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow public read access on programs" ON public.programs;
DROP POLICY IF EXISTS "Allow public read access on concours" ON public.concours;

-- 3. Create public SELECT policies
CREATE POLICY "Allow public read access on programs"
ON public.programs FOR SELECT
USING (true);

CREATE POLICY "Allow public read access on concours"
ON public.concours FOR SELECT
USING (true);
