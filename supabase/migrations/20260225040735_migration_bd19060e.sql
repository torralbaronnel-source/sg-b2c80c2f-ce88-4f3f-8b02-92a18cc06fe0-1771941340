-- 1. Total Reset of policies for the affected tables
DROP POLICY IF EXISTS "server_members_self_access" ON server_members;
DROP POLICY IF EXISTS "servers_owner_access" ON servers;
DROP POLICY IF EXISTS "server_members_view_self" ON server_members;
DROP POLICY IF EXISTS "server_members_view_owner" ON server_members;
DROP POLICY IF EXISTS "server_members_manage_owner" ON server_members;
DROP POLICY IF EXISTS "servers_view_owned" ON servers;
DROP POLICY IF EXISTS "servers_view_member" ON servers;
DROP POLICY IF EXISTS "servers_manage_owned" ON servers;

-- 2. Implement PURE ATOMIC POLICIES
-- These do NOT reference other tables, making recursion physically impossible.

-- Members table: You can ONLY see your own membership row.
ALTER TABLE server_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "atomic_member_access" 
ON server_members FOR ALL 
USING (auth.uid() = profile_id);

-- Servers table: You can ONLY see servers you directly own.
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "atomic_server_access" 
ON servers FOR ALL 
USING (auth.uid() = owner_id);

-- 3. Verify there are no other policies left that might reference the other table