-- Create profiles table first
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  cover_image_url text,
  bio text,
  location text,
  languages text[],
  phone text,
  social_links jsonb,
  visibility jsonb,
  role_profiles jsonb,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Create marketplace_projects table
CREATE TABLE public.marketplace_projects (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  client_user_id uuid,
  title text NOT NULL,
  shortDescription text,
  fullDescription text,
  category text,
  skills text[],
  budgetMin bigint,
  budgetMax bigint,
  currency text DEFAULT 'VND'::text,
  duration text,
  deadline timestamp with time zone,
  isUrgent boolean DEFAULT false,
  location text,
  attachments text[],
  objectives text[],
  technicalRequirements text[],
  deliverables text[],
  client jsonb,
  proposalCount integer DEFAULT 0,
  status text DEFAULT 'active'::text,
  freelancer_id uuid,
  CONSTRAINT marketplace_projects_pkey PRIMARY KEY (id),
  CONSTRAINT marketplace_projects_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id),
  CONSTRAINT marketplace_projects_freelancer_id_fkey FOREIGN KEY (freelancer_id) REFERENCES auth.users(id)
);

-- Create proposals table
CREATE TABLE public.proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  freelancer_id uuid,
  bid_amount numeric NOT NULL,
  timeline text,
  cover_letter text,
  status text NOT NULL DEFAULT 'submitted'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id bigint NOT NULL,
  CONSTRAINT proposals_pkey PRIMARY KEY (id),
  CONSTRAINT proposals_freelancer_id_fkey FOREIGN KEY (freelancer_id) REFERENCES auth.users(id),
  CONSTRAINT fk_proposals_project_id FOREIGN KEY (project_id) REFERENCES public.marketplace_projects(id)
);

-- Create saved_jobs table
CREATE TABLE public.saved_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  job_id bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT saved_jobs_pkey PRIMARY KEY (id),
  CONSTRAINT saved_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT saved_jobs_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.marketplace_projects(id)
);

-- Create recruitment_jobs table
CREATE TABLE public.recruitment_jobs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  user_id uuid,
  title text,
  department text,
  location text,
  locationType text,
  employmentType text,
  experienceLevel text,
  description text,
  responsibilities text,
  requirements text,
  skills text[],
  certifications text[],
  salaryMin bigint,
  salaryMax bigint,
  currency text DEFAULT 'VND'::text,
  showSalary boolean DEFAULT false,
  benefits text[],
  contractTerms text,
  applicationDeadline timestamp with time zone,
  screeningQuestions jsonb,
  autoResponse boolean DEFAULT false,
  responseTemplate text,
  attachments text[],
  companyMaterials text[],
  status text DEFAULT 'active'::text,
  templateType text,
  CONSTRAINT recruitment_jobs_pkey PRIMARY KEY (id),
  CONSTRAINT recruitment_jobs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create applications table
CREATE TABLE public.applications (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  jobId bigint,
  user_id uuid,
  fullName text,
  email text,
  phone text,
  address text,
  linkedin text,
  github text,
  portfolio text,
  summary text,
  technicalSkills jsonb,
  certifications text[],
  experienceLevel text,
  cv jsonb,
  coverLetter text,
  portfolioFile jsonb,
  certificates text[],
  customAnswers jsonb,
  applicationDate timestamp with time zone DEFAULT now(),
  status text DEFAULT 'submitted'::text,
  CONSTRAINT applications_pkey PRIMARY KEY (id),
  CONSTRAINT applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT applications_jobId_fkey FOREIGN KEY (jobId) REFERENCES public.recruitment_jobs(id)
);

-- Add indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_marketplace_projects_client_user_id ON marketplace_projects(client_user_id);
CREATE INDEX idx_marketplace_projects_freelancer_id ON marketplace_projects(freelancer_id);
CREATE INDEX idx_marketplace_projects_status ON marketplace_projects(status);
CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX idx_proposals_project_id ON proposals(project_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Basic RLS policies for marketplace_projects
CREATE POLICY "Anyone can view active projects" ON marketplace_projects
  FOR SELECT USING (status = 'active');

CREATE POLICY "Clients can create projects" ON marketplace_projects
  FOR INSERT WITH CHECK (auth.uid() = client_user_id);

CREATE POLICY "Clients can update their own projects" ON marketplace_projects
  FOR UPDATE USING (auth.uid() = client_user_id);

-- Basic RLS policies for proposals
CREATE POLICY "Freelancers can view proposals for public projects" ON proposals
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM marketplace_projects WHERE status = 'active'
    )
  );

CREATE POLICY "Freelancers can create proposals" ON proposals
  FOR INSERT WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can update their own proposals" ON proposals
  FOR UPDATE USING (auth.uid() = freelancer_id);

-- Basic RLS policies for saved_jobs
CREATE POLICY "Users can manage their own saved jobs" ON saved_jobs
  FOR ALL USING (auth.uid() = user_id);

-- Basic RLS policies for recruitment_jobs
CREATE POLICY "Anyone can view active recruitment jobs" ON recruitment_jobs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create recruitment jobs" ON recruitment_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recruitment jobs" ON recruitment_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Basic RLS policies for applications
CREATE POLICY "Users can view applications for their jobs" ON applications
  FOR SELECT USING (
    jobId IN (
      SELECT id FROM recruitment_jobs WHERE user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);
