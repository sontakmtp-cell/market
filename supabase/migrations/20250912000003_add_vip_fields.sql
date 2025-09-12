-- Add VIP display fields to marketplace_projects table
ALTER TABLE public.marketplace_projects 
ADD COLUMN displayType text DEFAULT 'standard',
ADD COLUMN vipFeePaid bigint DEFAULT 0,
ADD COLUMN vipActivatedAt timestamp with time zone;

-- Add comment for documentation
COMMENT ON COLUMN public.marketplace_projects.displayType IS 'Display type: standard or vip';
COMMENT ON COLUMN public.marketplace_projects.vipFeePaid IS 'VIP fee paid in VND (0 if not VIP)';
COMMENT ON COLUMN public.marketplace_projects.vipActivatedAt IS 'When VIP feature was activated';

-- Create index for VIP queries
CREATE INDEX idx_marketplace_projects_display_type ON marketplace_projects(displayType);
CREATE INDEX idx_marketplace_projects_vip_fee ON marketplace_projects(vipFeePaid);
