-- 1. Add role_type to distinguish internal team from external partners
    ALTER TABLE roles ADD COLUMN IF NOT EXISTS role_type TEXT DEFAULT 'internal' CHECK (role_type IN ('internal', 'external'));

    -- 2. Create the standard external roles if they don't exist
    INSERT INTO roles (name, description, hierarchy_level, role_type, is_system_role)
    VALUES 
      ('Client', 'External client with access to their specific events and invoices.', 100, 'external', true),
      ('Vendor', 'External service provider with access to production timelines.', 100, 'external', true),
      ('Visitor', 'Initial lead or visitor with minimal system access.', 100, 'external', true)
    ON CONFLICT (name) DO UPDATE SET role_type = 'external', is_system_role = true;

    -- 3. Update existing roles to be 'internal'
    UPDATE roles SET role_type = 'internal' WHERE name NOT IN ('Client', 'Vendor', 'Visitor');