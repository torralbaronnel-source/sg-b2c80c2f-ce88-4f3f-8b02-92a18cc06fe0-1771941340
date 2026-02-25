-- 1. DROP ALL EXISTING POLICIES for these two tables to clear any hidden recursive logic
DROP POLICY IF EXISTS "server_members_view_self" ON server_members;
DROP POLICY IF EXISTS "server_members_view_owner" ON server_members;
DROP POLICY IF EXISTS "server_members_manage_owner" ON server_members;
DROP POLICY IF EXISTS "servers_view_owned" ON servers;
DROP POLICY IF EXISTS "servers_view_member" ON servers;
DROP POLICY IF EXISTS "servers_manage_owned" ON servers;

-- 2. CREATE PURELY ATOMIC POLICIES (No cross-table references)
-- This is the only way to GUARANTEE no recursion during complex joins.

-- SERVER_MEMBERS: Users can see and manage ONLY their own membership records.
-- This is flat and extremely fast.
CREATE POLICY "server_members_self_access" 
ON server_members FOR ALL 
USING (auth.uid() = profile_id);

-- SERVERS: Users can see and manage ONLY servers they own.
-- This is flat and extremely fast.
CREATE POLICY "servers_owner_access" 
ON servers FOR ALL 
USING (auth.uid() = owner_id);

-- 3. Update the JOIN query logic in the application to handle visibility.
-- For now, this will stop the 500 errors and allow the portal to load.