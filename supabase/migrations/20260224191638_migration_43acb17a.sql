-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Organization Members & Roles (Tenant-level)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'coordinator', 'staff', 'vendor')),
  job_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Policies for Organizations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own organizations') THEN
        CREATE POLICY "Users can view their own organizations" 
          ON organizations FOR SELECT 
          USING (EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = organizations.id 
            AND organization_members.user_id = auth.uid()
          ));
    END IF;
END $$;

-- Policies for Members
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Members can view their teammates') THEN
        CREATE POLICY "Members can view their teammates" 
          ON organization_members FOR SELECT 
          USING (organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
          ));
    END IF;
END $$;