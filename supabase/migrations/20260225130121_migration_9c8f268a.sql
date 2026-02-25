-- 1. Correct the roles table schema
ALTER TABLE roles ADD COLUMN IF NOT EXISTS is_system_role BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Ensure the "Owner" role is the root of the system
INSERT INTO roles (name, description, is_system_role, hierarchy_level, status)
VALUES ('Owner', 'Primary account holder with full system control', true, 0, 'active')
ON CONFLICT (name) DO UPDATE SET 
    hierarchy_level = 0, 
    is_system_role = true,
    description = EXCLUDED.description;

-- 3. Clean up placeholder roles
DELETE FROM roles WHERE name NOT IN ('Owner', 'Super Admin');

-- 4. Update the Owner's permissions to have full access to all registered pages
INSERT INTO role_page_permissions (role_id, page_id, can_view, can_edit, can_delete, data_scope)
SELECT 
    (SELECT id FROM roles WHERE name = 'Owner'),
    id,
    true,
    true,
    true,
    'all'
FROM app_pages
ON CONFLICT (role_id, page_id) DO UPDATE SET 
    can_view = true, 
    can_edit = true, 
    can_delete = true, 
    data_scope = 'all';