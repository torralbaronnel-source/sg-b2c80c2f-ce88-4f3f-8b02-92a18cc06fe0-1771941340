-- 1. Remove legacy tables that are no longer used
DROP TABLE IF EXISTS login_attempts;

-- 2. Clean up current data tables to provide a fresh start
-- Using CASCADE to handle foreign key dependencies
TRUNCATE TABLE whatsapp_messages CASCADE;
TRUNCATE TABLE communications CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE organization_members CASCADE;
TRUNCATE TABLE organizations CASCADE;

-- Note: We keep the 'profiles' table but clear it if needed, 
-- however usually we want to keep the current user's profile to avoid lockout.
-- I will only delete profiles that don't have a corresponding auth user just in case.
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);