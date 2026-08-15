-- Partner Payments Schema
-- Records payment attempts / subscriptions for partner institutions.

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.partner_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'XAF',
    provider TEXT,
    provider_reference TEXT,
    status public.payment_status DEFAULT 'PENDING',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.partner_payments ENABLE ROW LEVEL SECURITY;

-- Allow partners to insert their own payment records
CREATE POLICY "Partners can insert own payments" ON public.partner_payments FOR INSERT WITH CHECK (
    institution_id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);

-- Allow partners to view their own payments
CREATE POLICY "Partners can view own payments" ON public.partner_payments FOR SELECT USING (
    institution_id IN (SELECT institution_id FROM public.institution_members WHERE user_id = auth.uid())
);
