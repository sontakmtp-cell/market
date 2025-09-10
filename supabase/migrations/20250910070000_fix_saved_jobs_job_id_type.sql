-- Fix saved_jobs table job_id type to match marketplace_projects id type
-- Drop existing table and recreate with correct data types

-- First, drop existing saved_jobs table
DROP TABLE IF EXISTS saved_jobs CASCADE;

-- Recreate saved_jobs table with correct job_id type (bigint instead of UUID)
CREATE TABLE saved_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES marketplace_projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can only save a job once
    UNIQUE(user_id, job_id)
);

-- Add indexes for better performance
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX idx_saved_jobs_created_at ON saved_jobs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see and manage their own saved jobs
CREATE POLICY "Users can view their own saved jobs" 
    ON saved_jobs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved jobs" 
    ON saved_jobs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved jobs" 
    ON saved_jobs FOR DELETE 
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_saved_jobs_updated_at_trigger
    BEFORE UPDATE ON saved_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_jobs_updated_at();

-- Add comment to table
COMMENT ON TABLE saved_jobs IS 'Stores jobs that users have saved for later viewing';
