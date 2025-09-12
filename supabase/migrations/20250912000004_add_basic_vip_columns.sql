-- Simple Migration: Essential VIP columns for marketplace_projects
-- Date: 2025-09-12
-- Description: Add minimum required columns for JobCardVIP functionality

-- Add essential VIP columns
ALTER TABLE public.marketplace_projects 
ADD COLUMN IF NOT EXISTS displayType text DEFAULT 'standard' CHECK (displayType IN ('standard', 'vip'));

ALTER TABLE public.marketplace_projects 
ADD COLUMN IF NOT EXISTS vipFeePaid numeric DEFAULT 0;

ALTER TABLE public.marketplace_projects 
ADD COLUMN IF NOT EXISTS vipActivatedAt timestamp with time zone;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_display_type ON public.marketplace_projects(displayType);

-- Update existing records
UPDATE public.marketplace_projects 
SET displayType = 'standard' 
WHERE displayType IS NULL;

-- Add comments
COMMENT ON COLUMN public.marketplace_projects.displayType IS 'Job display type: standard or vip';
COMMENT ON COLUMN public.marketplace_projects.vipFeePaid IS 'VIP fee amount paid in VND';
COMMENT ON COLUMN public.marketplace_projects.vipActivatedAt IS 'Timestamp when VIP was activated';
