-- 1. Create Organizations Table (The Tenant)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  branding_colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#64748b"}'::jsonb,
  settings JSONB DEFAULT '{"modules": ["crm", "events", "communication", "finance"]}'::jsonb,
  subscription_tier TEXT DEFAULT 'trial',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Organization Members (RBAC)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'coordinator' CHECK (role IN ('owner', 'admin', 'production_director', 'coordinator', 'staff', 'vendor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 3. Update Profiles to support multi-tenancy
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_organization_id UUID REFERENCES organizations(id);

-- 4. Enable RLS on core tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- 5. Create Helper Function to get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations()
RETURNS SETOF UUID AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 6. Define Policies for Organizations
CREATE POLICY "Users can view their own organizations" 
ON organizations FOR SELECT 
USING (id IN (SELECT get_user_organizations()));

CREATE POLICY "Owners and Admins can update their organization" 
ON organizations FOR UPDATE 
USING (
  id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- 7. Define Policies for Members
CREATE POLICY "Members can view other members in same org" 
ON organization_members FOR SELECT 
USING (organization_id IN (SELECT get_user_organizations()));

-- 8. Prepare Event Hub for Multi-tenancy
ALTER TABLE events ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Enable RLS on events if not already
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Event RLS: Only members of the org can see the events
CREATE POLICY "Users can view events of their organization" 
ON events FOR SELECT 
USING (organization_id IN (SELECT get_user_organizations()));

CREATE POLICY "Users can insert events for their organization" 
ON events FOR INSERT 
WITH CHECK (organization_id IN (SELECT get_user_organizations()));

CREATE POLICY "Users can update events of their organization" 
ON events FOR UPDATE 
USING (organization_id IN (SELECT get_user_organizations()));

CREATE POLICY "Users can delete events of their organization" 
ON events FOR DELETE 
USING (organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'production_director')));