-- =========== SCRIPT SỬA LỖI SUPABASE ===========
-- Chạy script này trong Supabase SQL Editor để sửa các lỗi

-- 1. Tạo bảng applications (nếu chưa có)
CREATE TABLE IF NOT EXISTS public.applications (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz,
  "jobId" bigint REFERENCES public.recruitment_jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  "fullName" text,
  email text,
  phone text,
  address text,
  linkedin text,
  github text,
  portfolio text,
  summary text,
  "technicalSkills" jsonb,
  certifications text[],
  "experienceLevel" text,
  cv jsonb,
  "coverLetter" text,
  "portfolioFile" jsonb,
  certificates jsonb[],
  "customAnswers" jsonb,
  "applicationDate" timestamptz DEFAULT now(),
  status text DEFAULT 'submitted'
);

-- 2. Bật RLS cho applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 3. Tạo RLS policies cho applications
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view applications for their jobs" ON public.applications;
  DROP POLICY IF EXISTS "Users can create applications" ON public.applications;
  DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
  DROP POLICY IF EXISTS "Job owners can update application status" ON public.applications;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Policies cho applications
CREATE POLICY "Users can view applications for their jobs" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.recruitment_jobs 
      WHERE recruitment_jobs.id = applications."jobId" 
      AND recruitment_jobs.user_id = auth.uid()
    )
    OR auth.uid() = user_id
  );

CREATE POLICY "Users can create applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Job owners can update application status" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.recruitment_jobs 
      WHERE recruitment_jobs.id = applications."jobId" 
      AND recruitment_jobs.user_id = auth.uid()
    )
  );

-- 4. Đảm bảo RLS policies cho các bảng khác
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  
  DROP POLICY IF EXISTS "Anyone can view active recruitment jobs" ON public.recruitment_jobs;
  DROP POLICY IF EXISTS "Users can create recruitment jobs" ON public.recruitment_jobs;
  DROP POLICY IF EXISTS "Users can update own recruitment jobs" ON public.recruitment_jobs;
  DROP POLICY IF EXISTS "Users can delete own recruitment jobs" ON public.recruitment_jobs;
  
  DROP POLICY IF EXISTS "Anyone can view active projects" ON public.marketplace_projects;
  DROP POLICY IF EXISTS "Users can create projects" ON public.marketplace_projects;
  DROP POLICY IF EXISTS "Users can update own projects" ON public.marketplace_projects;
  DROP POLICY IF EXISTS "Users can delete own projects" ON public.marketplace_projects;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Policies cho profiles
CREATE POLICY "Users can view public profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies cho recruitment_jobs
CREATE POLICY "Anyone can view active recruitment jobs" ON public.recruitment_jobs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create recruitment jobs" ON public.recruitment_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recruitment jobs" ON public.recruitment_jobs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recruitment jobs" ON public.recruitment_jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Policies cho marketplace_projects
CREATE POLICY "Anyone can view active projects" ON public.marketplace_projects
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create projects" ON public.marketplace_projects
  FOR INSERT WITH CHECK (auth.uid() = client_user_id);

CREATE POLICY "Users can update own projects" ON public.marketplace_projects
  FOR UPDATE USING (auth.uid() = client_user_id);

CREATE POLICY "Users can delete own projects" ON public.marketplace_projects
  FOR DELETE USING (auth.uid() = client_user_id);

-- 5. Kiểm tra và tạo trigger cho profile (nếu chưa có)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', new.email), 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.recruitment_jobs TO anon, authenticated;
GRANT ALL ON public.marketplace_projects TO anon, authenticated;
GRANT ALL ON public.applications TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Hoàn thành!
SELECT 'Hoàn thành setup Supabase!' as status;
