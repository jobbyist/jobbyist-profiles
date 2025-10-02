-- Create published_websites table for storing published resume websites
CREATE TABLE IF NOT EXISTS public.published_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  domain TEXT UNIQUE NOT NULL,
  html_content TEXT NOT NULL,
  template_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add published_url and published_at columns to resumes table
ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS published_url TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on published_websites
ALTER TABLE public.published_websites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own published websites
CREATE POLICY "Users can view their own published websites"
ON public.published_websites
FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM public.resumes WHERE id = published_websites.resume_id
));

-- Policy: Anyone can view published websites by domain (for public access)
CREATE POLICY "Public can view published websites"
ON public.published_websites
FOR SELECT
USING (true);

-- Policy: Users can insert their own published websites
CREATE POLICY "Users can insert their own published websites"
ON public.published_websites
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM public.resumes WHERE id = published_websites.resume_id
));

-- Policy: Users can update their own published websites
CREATE POLICY "Users can update their own published websites"
ON public.published_websites
FOR UPDATE
USING (auth.uid() IN (
  SELECT user_id FROM public.resumes WHERE id = published_websites.resume_id
));

-- Policy: Users can delete their own published websites
CREATE POLICY "Users can delete their own published websites"
ON public.published_websites
FOR DELETE
USING (auth.uid() IN (
  SELECT user_id FROM public.resumes WHERE id = published_websites.resume_id
));

-- Add trigger for updated_at on published_websites
CREATE TRIGGER handle_published_websites_updated_at
  BEFORE UPDATE ON public.published_websites
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_published_websites_domain ON public.published_websites(domain);
CREATE INDEX IF NOT EXISTS idx_published_websites_resume_id ON public.published_websites(resume_id);