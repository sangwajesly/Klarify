-- Create saved_programs table
CREATE TABLE IF NOT EXISTS public.saved_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id TEXT NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent a user from saving the same program multiple times
    UNIQUE(user_id, program_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.saved_programs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can select their own saved programs
CREATE POLICY "Users can view their own saved programs" 
ON public.saved_programs FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own saved programs
CREATE POLICY "Users can insert their own saved programs" 
ON public.saved_programs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved programs
CREATE POLICY "Users can delete their own saved programs" 
ON public.saved_programs FOR DELETE 
USING (auth.uid() = user_id);
