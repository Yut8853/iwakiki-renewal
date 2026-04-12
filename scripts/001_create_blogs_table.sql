-- Create blogs table to store blog posts
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  published_at DATE NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  excerpt TEXT,
  author_name TEXT,
  author_role TEXT,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can read published blogs)
CREATE POLICY "blogs_public_read" ON public.blogs
  FOR SELECT USING (true);

-- Create policy for authenticated users to manage blogs
CREATE POLICY "blogs_auth_insert" ON public.blogs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "blogs_auth_update" ON public.blogs
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "blogs_auth_delete" ON public.blogs
  FOR DELETE TO authenticated USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS blogs_updated_at ON public.blogs;
CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON public.blogs(featured);
