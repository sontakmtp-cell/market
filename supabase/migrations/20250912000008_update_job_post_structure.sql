-- Migration: Update job post structure
-- Date: 2025-09-12
-- Description: Remove technical requirements, duration fields and replace deadline with post duration

-- Add new columns for post duration management
ALTER TABLE public.marketplace_projects 
ADD COLUMN IF NOT EXISTS "postDuration" integer DEFAULT 30 CHECK ("postDuration" IN (7, 15, 30)),
ADD COLUMN IF NOT EXISTS "postExpiresAt" timestamp with time zone,
ADD COLUMN IF NOT EXISTS "autoDeleteAt" timestamp with time zone;

-- Add comments for documentation
COMMENT ON COLUMN public.marketplace_projects."postDuration" IS 'Duration to maintain the post in days (7, 15, or 30)';
COMMENT ON COLUMN public.marketplace_projects."postExpiresAt" IS 'When the post will expire and need renewal';
COMMENT ON COLUMN public.marketplace_projects."autoDeleteAt" IS 'When the post will be auto-deleted if no proposals accepted';

-- Create function to calculate expiration dates
CREATE OR REPLACE FUNCTION public.calculate_post_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate post expiration based on duration
  IF NEW."postDuration" IS NOT NULL THEN
    NEW."postExpiresAt" := NEW.created_at + (NEW."postDuration" || ' days')::INTERVAL;
    NEW."autoDeleteAt" := NEW."postExpiresAt";
  END IF;
  
  -- Update expiration when duration changes
  IF NEW."postDuration" != OLD."postDuration" AND NEW."postDuration" IS NOT NULL THEN
    NEW."postExpiresAt" := COALESCE(NEW.updated_at, NOW()) + (NEW."postDuration" || ' days')::INTERVAL;
    NEW."autoDeleteAt" := NEW."postExpiresAt";
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post expiration calculation
DROP TRIGGER IF EXISTS trigger_calculate_post_expiration ON public.marketplace_projects;
CREATE TRIGGER trigger_calculate_post_expiration
  BEFORE INSERT OR UPDATE ON public.marketplace_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_post_expiration();

-- Create function to auto-delete expired posts without accepted proposals
CREATE OR REPLACE FUNCTION public.auto_delete_expired_posts()
RETURNS void AS $$
BEGIN
  -- Delete posts that have expired and have no accepted proposals
  UPDATE public.marketplace_projects 
  SET status = 'expired_deleted',
      updated_at = NOW()
  WHERE "autoDeleteAt" < NOW() 
    AND status = 'active'
    AND id NOT IN (
      SELECT DISTINCT project_id 
      FROM public.proposals 
      WHERE status = 'accepted'
    );
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_post_duration ON public.marketplace_projects("postDuration");
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_post_expires_at ON public.marketplace_projects("postExpiresAt");
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_auto_delete_at ON public.marketplace_projects("autoDeleteAt");

-- Update existing projects with default post duration
UPDATE public.marketplace_projects 
SET "postDuration" = 30,
    "postExpiresAt" = created_at + INTERVAL '30 days',
    "autoDeleteAt" = created_at + INTERVAL '30 days'
WHERE "postDuration" IS NULL AND status = 'active';

-- Add constraint to ensure valid duration values
ALTER TABLE public.marketplace_projects 
ADD CONSTRAINT check_post_duration_valid 
CHECK ("postDuration" IS NULL OR "postDuration" IN (7, 15, 30));

-- Create view for active posts that are not expired
CREATE OR REPLACE VIEW public.active_marketplace_projects AS
SELECT mp.*
FROM public.marketplace_projects mp
WHERE mp.status = 'active' 
  AND (mp."postExpiresAt" IS NULL OR mp."postExpiresAt" > NOW());

-- Grant permissions
GRANT SELECT ON public.active_marketplace_projects TO authenticated;
GRANT EXECUTE ON FUNCTION public.auto_delete_expired_posts() TO authenticated;

-- Update RLS policies for the new structure
DROP POLICY IF EXISTS "Anyone can view active projects" ON marketplace_projects;
CREATE POLICY "Anyone can view non-expired active projects" ON marketplace_projects
  FOR SELECT USING (status = 'active' AND ("postExpiresAt" IS NULL OR "postExpiresAt" > NOW()));

-- Create a scheduled job function (to be called by cron or external scheduler)
CREATE OR REPLACE FUNCTION public.cleanup_expired_posts_job()
RETURNS void AS $$
BEGIN
  -- Mark expired posts
  PERFORM public.auto_delete_expired_posts();
  
  -- Log cleanup activity
  INSERT INTO public.system_logs (action, details, created_at)
  VALUES (
    'auto_cleanup_posts', 
    jsonb_build_object(
      'cleaned_at', NOW(),
      'posts_cleaned', (
        SELECT COUNT(*) 
        FROM public.marketplace_projects 
        WHERE status = 'expired_deleted' 
          AND updated_at::date = NOW()::date
      )
    ),
    NOW()
  ) 
  ON CONFLICT DO NOTHING; -- In case system_logs table doesn't exist yet
EXCEPTION 
  WHEN others THEN
    -- Ignore if system_logs table doesn't exist
    NULL;
END;
$$ LANGUAGE plpgsql;

-- Note: The following fields will be deprecated but kept for backward compatibility:
-- - duration (text): Will be ignored in new job posts
-- - deadline (timestamp): Will be ignored in new job posts  
-- - technicalRequirements (array): Will be ignored in new job posts

-- Add deprecation comments
COMMENT ON COLUMN public.marketplace_projects.duration IS 'DEPRECATED: Use postDuration instead';
COMMENT ON COLUMN public.marketplace_projects.deadline IS 'DEPRECATED: Use postExpiresAt instead';  
COMMENT ON COLUMN public.marketplace_projects."technicalRequirements" IS 'DEPRECATED: Technical requirements removed from job posts';

-- Create a helper function to extend post duration (for renewals)
CREATE OR REPLACE FUNCTION public.extend_post_duration(
  project_id bigint, 
  additional_days integer DEFAULT 30
)
RETURNS boolean AS $$
DECLARE
  project_record RECORD;
BEGIN
  -- Get current project
  SELECT * INTO project_record 
  FROM public.marketplace_projects 
  WHERE id = project_id 
    AND client_user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Extend the post duration
  UPDATE public.marketplace_projects 
  SET "postExpiresAt" = GREATEST(NOW(), "postExpiresAt") + (additional_days || ' days')::INTERVAL,
      "autoDeleteAt" = GREATEST(NOW(), "postExpiresAt") + (additional_days || ' days')::INTERVAL,
      updated_at = NOW()
  WHERE id = project_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission for the extension function
GRANT EXECUTE ON FUNCTION public.extend_post_duration(bigint, integer) TO authenticated;