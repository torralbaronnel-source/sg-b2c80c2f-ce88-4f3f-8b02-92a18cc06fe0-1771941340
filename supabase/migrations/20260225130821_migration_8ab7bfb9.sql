-- 1. Update hierarchy_level constraints for the 0-10 scale
-- First, normalize any existing roles that might be outside the 0-10 range
UPDATE roles SET hierarchy_level = 10 WHERE hierarchy_level > 10 AND role_type = 'internal';
UPDATE roles SET hierarchy_level = 0 WHERE name = 'Owner';

-- 2. Ensure External roles have a default high number or null if preferred, 
-- but we'll use 10 as a fallback for consistency in sorting.
UPDATE roles SET hierarchy_level = 10 WHERE role_type = 'external';

-- 3. Update the check constraint for the 0-10 range
ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_hierarchy_level_check;
ALTER TABLE roles ADD CONSTRAINT roles_hierarchy_level_check CHECK (hierarchy_level >= 0 AND hierarchy_level <= 10);