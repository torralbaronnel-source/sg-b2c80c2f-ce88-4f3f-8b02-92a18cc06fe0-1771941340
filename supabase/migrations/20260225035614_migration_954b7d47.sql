-- 1. Create the Servers table (Extending Organizations concept)
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_handle TEXT UNIQUE NOT NULL, -- The 18-digit identifier
  name TEXT NOT NULL,
  logo_url TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE,
  is_invite_active BOOLEAN DEFAULT true,
  invite_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add server_id to core tables for multi-tenancy
ALTER TABLE events ADD COLUMN IF NOT EXISTS server_id UUID REFERENCES servers(id) ON DELETE CASCADE;
ALTER TABLE communications ADD COLUMN IF NOT EXISTS server_id UUID REFERENCES servers(id) ON DELETE CASCADE;

-- 3. Update profiles to include current_server_id for session persistence
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_server_id UUID REFERENCES servers(id) ON DELETE SET NULL;

-- 4. Create Server Members table
CREATE TABLE IF NOT EXISTS server_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'coordinator', -- 'portal_admin', 'coordinator', 'staff'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(server_id, profile_id)
);

-- 5. Enable RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_members ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Servers
CREATE POLICY "Users can view servers they are members of" ON servers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM server_members WHERE server_id = servers.id AND profile_id = auth.uid())
    OR owner_id = auth.uid()
  );

CREATE POLICY "Owners can update their servers" ON servers
  FOR UPDATE USING (owner_id = auth.uid());

-- 7. RLS Policies for Server Members
CREATE POLICY "Members can view their fellow members" ON server_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM server_members sm WHERE sm.server_id = server_members.server_id AND sm.profile_id = auth.uid())
  );

CREATE POLICY "Portal Admins can manage members" ON server_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM server_members sm WHERE sm.server_id = server_members.server_id AND sm.profile_id = auth.uid() AND sm.role = 'portal_admin')
    OR EXISTS (SELECT 1 FROM servers s WHERE s.id = server_members.server_id AND s.owner_id = auth.uid())
  );