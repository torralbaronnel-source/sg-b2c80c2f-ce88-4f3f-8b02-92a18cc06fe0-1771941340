-- 1. Create a registry for all pages in the platform
CREATE TABLE IF NOT EXISTS app_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    route TEXT NOT NULL UNIQUE,
    module TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert the current page registry
INSERT INTO app_pages (name, route, module, description) VALUES
('Overview Dashboard', '/dashboard', 'Dashboard', 'Main analytics and overview'),
('Live Event Feed', '/events/live', 'Events', 'Real-time event tracking'),
('Leads Management', '/leads', 'CRM', 'Sales and lead tracking'),
('Client Database', '/crm', 'CRM', 'Client contact and history'),
('Quotes Builder', '/quotes', 'Finance', 'Creating and sending quotes'),
('Invoice Management', '/invoices', 'Finance', 'Billing and payment tracking'),
('Master Timelines', '/timelines', 'Events', 'Detailed event scheduling'),
('Venue Management', '/venues', 'Events', 'Database of venues and details'),
('Guest & RSVP', '/guests', 'Events', 'Guest list and RSVP management'),
('Production Hub', '/production', 'Logistics', 'Resource and vendor planning'),
('Team Chats', '/communication', 'Communication', 'Internal messaging system'),
('User Management', '/admin/users', 'Admin', 'Managing staff accounts'),
('Org & Roles', '/admin/org-management', 'Admin', 'SaaS configuration and hierarchy')
ON CONFLICT (route) DO UPDATE SET name = EXCLUDED.name, module = EXCLUDED.module;

-- 3. Enhance roles table with levels and status
ALTER TABLE roles ADD COLUMN IF NOT EXISTS hierarchy_level INTEGER DEFAULT 100;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'restricted'));

-- 4. Create granular page-level permissions table
CREATE TABLE IF NOT EXISTS role_page_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    page_id UUID REFERENCES app_pages(id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT false,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    data_scope TEXT DEFAULT 'self' CHECK (data_scope IN ('all', 'team', 'self')),
    UNIQUE(role_id, page_id)
);

-- 5. Enable RLS
ALTER TABLE app_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_page_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of app pages" ON app_pages FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage permissions" ON role_page_permissions FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role_id IN (SELECT id FROM roles WHERE name = 'Super Admin')));