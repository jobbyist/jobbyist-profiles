-- Create published_websites table
CREATE TABLE IF NOT EXISTS public.published_websites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    domain TEXT NOT NULL UNIQUE,
    html_content TEXT NOT NULL,
    template_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.published_websites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own published websites
CREATE POLICY "Users can view own published websites"
    ON public.published_websites
    FOR SELECT
    USING (
        resume_id IN (
            SELECT id FROM public.resumes WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can insert their own published websites
CREATE POLICY "Users can insert own published websites"
    ON public.published_websites
    FOR INSERT
    WITH CHECK (
        resume_id IN (
            SELECT id FROM public.resumes WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can update their own published websites
CREATE POLICY "Users can update own published websites"
    ON public.published_websites
    FOR UPDATE
    USING (
        resume_id IN (
            SELECT id FROM public.resumes WHERE user_id = auth.uid()
        )
    );

-- Policy: Users can delete their own published websites
CREATE POLICY "Users can delete own published websites"
    ON public.published_websites
    FOR DELETE
    USING (
        resume_id IN (
            SELECT id FROM public.resumes WHERE user_id = auth.uid()
        )
    );

-- Policy: Allow public to view published websites (for serving them)
CREATE POLICY "Public can view published websites"
    ON public.published_websites
    FOR SELECT
    USING (true);

-- Add published_url and published_at columns to resumes table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'resumes' AND column_name = 'published_url'
    ) THEN
        ALTER TABLE public.resumes ADD COLUMN published_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'resumes' AND column_name = 'published_at'
    ) THEN
        ALTER TABLE public.resumes ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_published_websites_domain ON public.published_websites(domain);
CREATE INDEX IF NOT EXISTS idx_published_websites_resume_id ON public.published_websites(resume_id);
