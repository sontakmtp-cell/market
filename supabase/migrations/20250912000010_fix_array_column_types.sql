-- Drop the dependent views before altering the table
DROP VIEW IF EXISTS public.active_vip_projects;
DROP VIEW IF EXISTS public.active_marketplace_projects;

-- Fix ARRAY column types in marketplace_projects table
-- This migration ensures all ARRAY columns have proper data types

-- Fix skills column - ensure it's text[]
ALTER TABLE marketplace_projects 
ALTER COLUMN skills TYPE text[] USING (
  CASE 
    WHEN skills IS NULL THEN ARRAY[]::text[]
    ELSE skills
  END
);

-- Fix attachments column - convert to jsonb[] properly
ALTER TABLE marketplace_projects 
ALTER COLUMN attachments TYPE jsonb[] USING (
  CASE 
    WHEN attachments IS NULL THEN '{}'::jsonb[]
    WHEN pg_typeof(attachments) = 'text[]'::regtype THEN 
      ARRAY(SELECT to_jsonb(elem) FROM unnest(attachments) AS elem)
    ELSE attachments::jsonb[]
  END
);

-- Fix objectives column - ensure it's text[]
ALTER TABLE marketplace_projects 
ALTER COLUMN objectives TYPE text[] USING (
  CASE 
    WHEN objectives IS NULL THEN ARRAY[]::text[]
    WHEN pg_typeof(objectives) = 'jsonb[]'::regtype THEN 
      ARRAY(SELECT elem#>>'{}'::text[] FROM unnest(objectives) AS elem)
    ELSE objectives
  END
);

-- Fix technicalRequirements column - ensure it's text[]
ALTER TABLE marketplace_projects 
ALTER COLUMN technicalRequirements TYPE text[] USING (
  CASE 
    WHEN technicalRequirements IS NULL THEN ARRAY[]::text[]
    WHEN pg_typeof(technicalRequirements) = 'jsonb[]'::regtype THEN 
      ARRAY(SELECT elem#>>'{}'::text[] FROM unnest(technicalRequirements) AS elem)
    ELSE technicalRequirements
  END
);

-- Fix deliverables column - convert to jsonb[] properly  
ALTER TABLE marketplace_projects 
ALTER COLUMN deliverables TYPE jsonb[] USING (
  CASE 
    WHEN deliverables IS NULL THEN '{}'::jsonb[]
    WHEN pg_typeof(deliverables) = 'text[]'::regtype THEN 
      ARRAY(SELECT to_jsonb(elem) FROM unnest(deliverables) AS elem)
    ELSE deliverables::jsonb[]
  END
);

-- Add comments for the fixed columns
COMMENT ON COLUMN marketplace_projects.skills IS 'Required skills as text array';
COMMENT ON COLUMN marketplace_projects.attachments IS 'File attachments as jsonb array';
COMMENT ON COLUMN marketplace_projects.objectives IS 'Project objectives as text array';
COMMENT ON COLUMN marketplace_projects.technicalRequirements IS 'Technical requirements as text array';
COMMENT ON COLUMN marketplace_projects.deliverables IS 'Project deliverables as jsonb array';

-- Recreate the view for active VIP projects
CREATE OR REPLACE VIEW public.active_vip_projects AS
SELECT mp.*
FROM public.marketplace_projects mp
WHERE mp.displayType = 'vip' 
  AND mp.vipActivatedAt IS NOT NULL
  AND (mp.vipExpiresAt IS NULL OR mp.vipExpiresAt > NOW())
  AND mp.status = 'active';

-- Grant permissions on the recreated view
GRANT SELECT ON public.active_vip_projects TO authenticated;

-- Recreate the view for active posts that are not expired
CREATE OR REPLACE VIEW public.active_marketplace_projects AS
SELECT mp.*
FROM public.marketplace_projects mp
WHERE mp.status = 'active' 
  AND (mp."postExpiresAt" IS NULL OR mp."postExpiresAt" > NOW());

-- Grant permissions
GRANT SELECT ON public.active_marketplace_projects TO authenticated;
