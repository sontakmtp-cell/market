-- Migration to fix job post data structure compatibility
-- This ensures the marketplace_projects table has all necessary fields for job posting

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add vipExpiresAt if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'marketplace_projects' 
                   AND column_name = 'vipExpiresAt') THEN
        ALTER TABLE marketplace_projects 
        ADD COLUMN "vipExpiresAt" timestamp with time zone;
    END IF;

    -- Add vipPaymentReference if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'marketplace_projects' 
                   AND column_name = 'vipPaymentReference') THEN
        ALTER TABLE marketplace_projects 
        ADD COLUMN "vipPaymentReference" text;
    END IF;

    -- Add vipPaymentStatus if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'marketplace_projects' 
                   AND column_name = 'vipPaymentStatus') THEN
        ALTER TABLE marketplace_projects 
        ADD COLUMN "vipPaymentStatus" text DEFAULT 'pending'::text 
        CHECK ("vipPaymentStatus" = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text, 'refunded'::text]));
    END IF;

    -- Add postExpiresAt if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'marketplace_projects' 
                   AND column_name = 'postExpiresAt') THEN
        ALTER TABLE marketplace_projects 
        ADD COLUMN "postExpiresAt" timestamp with time zone;
    END IF;

    -- Add autoDeleteAt if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'marketplace_projects' 
                   AND column_name = 'autoDeleteAt') THEN
        ALTER TABLE marketplace_projects 
        ADD COLUMN "autoDeleteAt" timestamp with time zone;
    END IF;

    -- Add technicalRequirements if not exists (for job post compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'marketplace_projects' 
                   AND column_name = 'technicalRequirements') THEN
        ALTER TABLE marketplace_projects 
        ADD COLUMN "technicalRequirements" text[];
    END IF;
END $$;

-- Update existing records to have proper data types
UPDATE marketplace_projects 
SET 
    "budgetMin" = COALESCE("budgetMin", 0),
    "budgetMax" = COALESCE("budgetMax", 0),
    "postDuration" = COALESCE("postDuration", 30),
    "isUrgent" = COALESCE("isUrgent", false),
    currency = COALESCE(currency, 'VND'),
    status = COALESCE(status, 'active'),
    "proposalCount" = COALESCE("proposalCount", 0),
    "vipFeePaid" = COALESCE("vipFeePaid", 0),
    "vipPaymentStatus" = COALESCE("vipPaymentStatus", 'pending')
WHERE 
    "budgetMin" IS NULL 
    OR "budgetMax" IS NULL 
    OR "postDuration" IS NULL 
    OR "isUrgent" IS NULL 
    OR currency IS NULL 
    OR status IS NULL 
    OR "proposalCount" IS NULL 
    OR "vipFeePaid" IS NULL 
    OR "vipPaymentStatus" IS NULL;

-- Ensure client column has proper structure for existing records
UPDATE marketplace_projects 
SET "client" = COALESCE("client", '{
    "name": "Khách hàng",
    "company": "",
    "rating": 5,
    "reviewCount": 0,
    "location": ""
}'::jsonb)
WHERE "client" IS NULL OR "client" = '{}'::jsonb;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_status ON marketplace_projects(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_display_type ON marketplace_projects("displayType");
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_created_at ON marketplace_projects(created_at);
CREATE INDEX IF NOT EXISTS idx_marketplace_projects_client_user_id ON marketplace_projects(client_user_id);

-- Add comments for documentation
COMMENT ON COLUMN marketplace_projects."budgetMin" IS 'Minimum budget for the project in specified currency';
COMMENT ON COLUMN marketplace_projects."budgetMax" IS 'Maximum budget for the project in specified currency';
COMMENT ON COLUMN marketplace_projects."postDuration" IS 'Duration in days that the post will remain active (7, 15, or 30)';
COMMENT ON COLUMN marketplace_projects."isUrgent" IS 'Whether the project is marked as urgent';
COMMENT ON COLUMN marketplace_projects."displayType" IS 'Display type: standard or vip';
COMMENT ON COLUMN marketplace_projects."vipFeePaid" IS 'VIP fee amount paid for premium display';
COMMENT ON COLUMN marketplace_projects."vipActivatedAt" IS 'When VIP features were activated';
COMMENT ON COLUMN marketplace_projects."vipExpiresAt" IS 'When VIP features expire';
COMMENT ON COLUMN marketplace_projects."vipPaymentStatus" IS 'VIP payment status: pending, paid, failed, or refunded';
COMMENT ON COLUMN marketplace_projects."vipPaymentReference" IS 'VIP payment reference or transaction ID';
COMMENT ON COLUMN marketplace_projects."postExpiresAt" IS 'When the job post expires';
COMMENT ON COLUMN marketplace_projects."autoDeleteAt" IS 'When the post will be automatically deleted';
COMMENT ON COLUMN marketplace_projects."client" IS 'Client information as JSON object';
COMMENT ON COLUMN marketplace_projects."objectives" IS 'Project objectives as array';
COMMENT ON COLUMN marketplace_projects."deliverables" IS 'Project deliverables as array of objects';
COMMENT ON COLUMN marketplace_projects."attachments" IS 'File attachments as array of objects';
COMMENT ON COLUMN marketplace_projects."skills" IS 'Required skills as array';
COMMENT ON COLUMN marketplace_projects."technicalRequirements" IS 'Technical requirements as array';
COMMENT ON COLUMN marketplace_projects."proposalCount" IS 'Number of proposals received for this project';
COMMENT ON COLUMN marketplace_projects.currency IS 'Currency for budget amounts (VND, USD, etc.)';
COMMENT ON COLUMN marketplace_projects.status IS 'Project status: active, completed, cancelled, etc.';
COMMENT ON COLUMN marketplace_projects.created_at IS 'When the project was created';
COMMENT ON COLUMN marketplace_projects.updated_at IS 'When the project was last updated';
COMMENT ON COLUMN marketplace_projects.client_user_id IS 'ID of the user who created this project';
COMMENT ON COLUMN marketplace_projects.title IS 'Project title';
COMMENT ON COLUMN marketplace_projects."shortDescription" IS 'Brief project description';
COMMENT ON COLUMN marketplace_projects."fullDescription" IS 'Detailed project description';
COMMENT ON COLUMN marketplace_projects.category IS 'Primary project category';
COMMENT ON COLUMN marketplace_projects.location IS 'Project location';
COMMENT ON COLUMN marketplace_projects.freelancer_id IS 'ID of the freelancer assigned to this project';
COMMENT ON COLUMN marketplace_projects.deadline IS 'Project deadline';
COMMENT ON COLUMN marketplace_projects.id IS 'Unique project identifier';
