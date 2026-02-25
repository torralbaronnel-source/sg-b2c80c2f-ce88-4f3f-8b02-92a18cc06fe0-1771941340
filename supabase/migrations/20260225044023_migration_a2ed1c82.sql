-- 1. Add industry and blueprint columns to servers table
ALTER TABLE servers ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE servers ADD COLUMN IF NOT EXISTS blueprint JSONB DEFAULT '{}'::jsonB;

-- 2. Ensure RLS policies are up to date (already mostly handled, but ensuring owner can update/insert)
-- The schema shows owner_id = uid() policies already exist.