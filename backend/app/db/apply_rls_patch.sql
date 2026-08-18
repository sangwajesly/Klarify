-- Apply this patch in your Supabase SQL Editor

-- 1. Ensure University Admins can view their own institution even if it is PENDING
-- Without this, an admin would be locked out of their own dashboard until verified,
-- because the public policy hides PENDING institutions.
DROP POLICY IF EXISTS "Uni admins can select own institution" ON public.institutions;
CREATE POLICY "Uni admins can select own institution" ON public.institutions FOR SELECT USING (
    id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);
