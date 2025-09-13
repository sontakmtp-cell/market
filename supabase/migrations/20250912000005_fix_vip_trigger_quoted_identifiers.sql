-- Fix VIP expiration trigger function to use quoted identifiers
-- to match camelCase columns that were created quoted in PostgreSQL

CREATE OR REPLACE FUNCTION public.set_vip_expiration()
RETURNS TRIGGER AS $$
BEGIN
  -- If VIP is activated and no expiration is set, set it to 30 days from activation
  IF NEW."displayType" = 'vip' AND NEW."vipActivatedAt" IS NOT NULL AND NEW."vipExpiresAt" IS NULL THEN
    NEW."vipExpiresAt" := NEW."vipActivatedAt" + INTERVAL '30 days';
  END IF;

  -- If changing from VIP to standard, clear VIP timestamps
  IF NEW."displayType" = 'standard' AND OLD."displayType" = 'vip' THEN
    NEW."vipActivatedAt" := NULL;
    NEW."vipExpiresAt" := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- No need to recreate the trigger if it already exists; function replacement is enough
