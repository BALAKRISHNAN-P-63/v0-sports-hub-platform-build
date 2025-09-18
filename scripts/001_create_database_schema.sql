-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  sport TEXT,
  position TEXT,
  age INTEGER,
  location TEXT,
  bio TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media uploads table for videos and images
CREATE TABLE IF NOT EXISTS public.media_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'video' or 'image'
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  tags TEXT[]
);

-- Create assessments table for AI analysis results
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media_uploads(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL, -- 'posture', 'technique', etc.
  results JSONB NOT NULL, -- Store AI analysis results
  score INTEGER, -- Overall score out of 100
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenges table for sports challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sport TEXT NOT NULL,
  difficulty_level TEXT NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  requirements TEXT[],
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user_challenges table for tracking participation
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'
  submission_media_id UUID REFERENCES public.media_uploads(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

-- Create RLS policies for media uploads
CREATE POLICY "Users can view their own media" ON public.media_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media" ON public.media_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media" ON public.media_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media" ON public.media_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for assessments
CREATE POLICY "Users can view their own assessments" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON public.assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for challenges (public read, admin write)
CREATE POLICY "Anyone can view challenges" ON public.challenges
  FOR SELECT USING (true);

-- Create RLS policies for user challenges
CREATE POLICY "Users can view their own challenge participation" ON public.user_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge participation" ON public.user_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge participation" ON public.user_challenges
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
