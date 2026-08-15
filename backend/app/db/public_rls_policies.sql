-- Enable public read access (SELECT) on programs and concours tables in Supabase
-- Run this in your Supabase SQL Editor to allow anonymous web users to query the database.

-- 1. Enable RLS on programs and concours tables if not enabled
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concours ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any to prevent conflicts

DROP POLICY IF EXISTS "Allow public read access on programs" ON public.programs;
DROP POLICY IF EXISTS "Allow public read access on concours" ON public.concours;

-- 3. Create public SELECT policies
-- Public may read programs that are explicitly approved OR belong to an institution
-- whose `verification_status` is 'VERIFIED'. This lets verifying an institution
-- publish all its programs at once.
CREATE POLICY "Allow public read access on programs"
ON public.programs FOR SELECT
USING (
	is_approved = true
	OR (
		institution_id IS NOT NULL
		AND EXISTS (
			SELECT 1 FROM public.institutions i WHERE i.id = public.programs.institution_id AND i.verification_status = 'VERIFIED'
		)
	)
);

CREATE POLICY "Allow public read access on concours"
ON public.concours FOR SELECT
USING (true);
