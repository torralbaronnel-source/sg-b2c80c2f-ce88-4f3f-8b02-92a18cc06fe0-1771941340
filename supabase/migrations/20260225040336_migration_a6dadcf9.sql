-- 1. Reset everything for these two tables to ensure no hidden recursive policies exist
DROP POLICY IF EXISTS "Users can view their own memberships" ON server_members;
DROP POLICY IF EXISTS "Server owners can manage all memberships" ON server_members;
DROP POLICY IF EXISTS "Users can view servers they own" ON servers;
DROP POLICY IF EXISTS "Users can view servers they are members of" ON servers;
DROP POLICY IF EXISTS "Admins can manage memberships" ON server_members;
DROP POLICY IF EXISTS "Direct membership view" ON server_members;

-- 2. FLAT POLICY FOR SERVER_MEMBERS
-- A user can see a membership record if it's THEIRS.
-- This is a simple column-to-value check. No joins. No recursion.
CREATE POLICY "server_members_select_own" 
ON server_members FOR SELECT 
USING (auth.uid() = profile_id);

-- 3. FLAT POLICY FOR SERVERS
-- A user can see a server if they are the OWNER.
-- Again, simple column-to-value check.
CREATE POLICY "servers_select_own" 
ON servers FOR SELECT 
USING (auth.uid() = owner_id);

-- 4. MEMBERSHIP VISIBILITY FOR SERVERS (The only "join" allowed)
-- We allow users to see servers they are members of by checking a subquery 
-- that ONLY uses the 'server_members_select_own' policy logic internally.
CREATE POLICY "servers_select_member" 
ON servers FOR SELECT 
USING (
  id IN (
    SELECT server_id FROM server_members 
    WHERE profile_id = auth.uid()
  )
);

-- 5. MANAGEMENT POLICY (Non-recursive)
-- Owners can manage their server's members.
-- This uses the 'servers' table check but won't recurse because 
-- 'servers_select_own' is a flat check.
CREATE POLICY "server_members_admin_all" 
ON server_members FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM servers 
    WHERE servers.id = server_members.server_id 
    AND servers.owner_id = auth.uid()
  )
);