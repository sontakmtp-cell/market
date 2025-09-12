-- Migration: Add VIP features to marketplace_projects table
-- Date: 2025-09-12
-- Description: Add columns for VIP job posting functionality

-- Add VIP-related columns to marketplace_projects table
ALTER TABLE public.marketplace_projects 
ADD COLUMN IF NOT EXISTS displayType text DEFAULT 'standard'::text CHECK (displayType IN ('standard', 'vip')),
ADD COLUMN IF NOT EXISTS vipFeePaid numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS vipActivatedAt timestamp with time zone,
ADD COLUMN IF NOT EXISTS vipExpiresAt timestamp with time zone,
ADD COLUMN IF NOT EXISTS vipPaymentReference text,
ADD COLUMN IF NOT EXISTS vipPaymentStatus text DEFAULT 'pending'::text CHECK (vipPaymentStatus IN ('pending', 'paid', 'failed', 'refunded'));

-- Add index for VIP filtering and sorting
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_display_type ON public.marketplace_projects(displayType);
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_vip_activated ON public.marketplace_projects(vipActivatedAt) WHERE displayType = 'vip';

-- Add comments for documentation
COMMENT ON COLUMN public.marketplace_projects.displayType IS 'Type of job display: standard or vip';
COMMENT ON COLUMN public.marketplace_projects.vipFeePaid IS 'Amount paid for VIP features in VND';
COMMENT ON COLUMN public.marketplace_projects.vipActivatedAt IS 'When VIP features were activated';
COMMENT ON COLUMN public.marketplace_projects.vipExpiresAt IS 'When VIP features expire (optional)';
COMMENT ON COLUMN public.marketplace_projects.vipPaymentReference IS 'Payment reference/transaction ID for VIP fee';
COMMENT ON COLUMN public.marketplace_projects.vipPaymentStatus IS 'Status of VIP payment';

-- Update existing projects to have default values
UPDATE public.marketplace_projects 
SET displayType = 'standard' 
WHERE displayType IS NULL;

-- Create function to automatically set VIP expiration (optional - for future use)
CREATE OR REPLACE FUNCTION public.set_vip_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- If VIP is activated and no expiration is set, set it to 30 days from activation
  IF NEW.displayType = 'vip' AND NEW.vipActivatedAt IS NOT NULL AND NEW.vipExpiresAt IS NULL THEN
    NEW.vipExpiresAt := NEW.vipActivatedAt + INTERVAL '30 days';
  END IF;
  
  -- If changing from VIP to standard, clear VIP timestamps
  IF NEW.displayType = 'standard' AND OLD.displayType = 'vip' THEN
    NEW.vipActivatedAt := NULL;
    NEW.vipExpiresAt := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for VIP expiration management
DROP TRIGGER IF EXISTS trigger_set_vip_expiration ON public.marketplace_projects;
CREATE TRIGGER trigger_set_vip_expiration
  BEFORE UPDATE ON public.marketplace_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_vip_expiration();

-- Create function to check if VIP has expired
CREATE OR REPLACE FUNCTION public.is_vip_expired(project_id bigint)
RETURNS boolean AS $$
DECLARE
  project_record RECORD;
BEGIN
  SELECT displayType, vipExpiresAt 
  INTO project_record 
  FROM public.marketplace_projects 
  WHERE id = project_id;
  
  -- If not VIP, return false
  IF project_record.displayType != 'vip' THEN
    RETURN false;
  END IF;
  
  -- If no expiration set, VIP is still active
  IF project_record.vipExpiresAt IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if expired
  RETURN project_record.vipExpiresAt < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create view for active VIP projects
CREATE OR REPLACE VIEW public.active_vip_projects AS
SELECT mp.*
FROM public.marketplace_projects mp
WHERE mp.displayType = 'vip' 
  AND mp.vipActivatedAt IS NOT NULL
  AND (mp.vipExpiresAt IS NULL OR mp.vipExpiresAt > NOW())
  AND mp.status = 'active';

-- Grant permissions
GRANT SELECT ON public.active_vip_projects TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_vip_expired(bigint) TO authenticated;

-- Create RLS policies for VIP features
-- Policy for viewing VIP status
CREATE POLICY "Users can view VIP status of all projects" ON public.marketplace_projects
FOR SELECT USING (true);

-- Policy for updating VIP status (only project owners)
CREATE POLICY "Project owners can update VIP status" ON public.marketplace_projects
FOR UPDATE USING (auth.uid() = client_user_id);

-- Insert some test VIP data (optional - for development)
-- Uncomment the following lines if you want to create test VIP projects

/*
-- Create test VIP projects
INSERT INTO public.marketplace_projects (
  title, 
  shortDescription, 
  fullDescription, 
  category, 
  skills, 
  budgetMin, 
  budgetMax, 
  deadline, 
  displayType, 
  vipFeePaid, 
  vipActivatedAt,
  vipPaymentStatus,
  client_user_id
) VALUES 
(
  'Phát triển ứng dụng mobile VIP',
  'Cần freelancer có kinh nghiệm phát triển ứng dụng mobile',
  'Dự án phát triển ứng dụng mobile cho startup công nghệ...',
  'electronic',
  ARRAY['React Native', 'JavaScript', 'API Integration'],
  15000000,
  25000000,
  NOW() + INTERVAL '30 days',
  'vip',
  10000,
  NOW(),
  'paid',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Thiết kế website VIP',
  'Thiết kế website hiện đại và responsive',
  'Cần thiết kế website cho công ty với giao diện hiện đại...',
  'architecture',
  ARRAY['UI/UX Design', 'Figma', 'Responsive Design'],
  10000000,
  20000000,
  NOW() + INTERVAL '25 days',
  'vip',
  10000,
  NOW(),
  'paid',
  (SELECT id FROM auth.users LIMIT 1)
);
*/
