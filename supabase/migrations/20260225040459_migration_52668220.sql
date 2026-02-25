-- 1. Create a "Security Definer" function to break the recursion.
-- This function runs with the privileges of the creator (postgres), 
-- bypassing RLS to perform a clean, single-pass check.
CREATE OR REPLACE FUNCTION check_server_ownership(s_id UUID, p_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM servers 
    WHERE id = s_id 
    AND owner_id = p_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop all previous recursive policies
DROP POLICY IF EXISTS "server_members_select_own" ON server_members;
DROP POLICY IF EXISTS "server_members_admin_all" ON server_members;
DROP POLICY IF EXISTS "servers_select_own" ON servers;
DROP POLICY IF EXISTS "servers_select_member" ON servers;

-- 3. SERVER_MEMBERS POLICIES
-- Users can see their own membership (Flat check)
CREATE POLICY "server_members_view_self" 
ON server_members FOR SELECT 
USING (auth.uid() = profile_id);

-- Owners can see all members using the non-recursive function
CREATE POLICY "server_members_view_owner" 
ON server_members FOR SELECT 
USING (check_server_ownership(server_id, auth.uid()));

-- Owners can manage all members using the non-recursive function
CREATE POLICY "server_members_manage_owner" 
ON server_members FOR ALL 
USING (check_server_ownership(server_id, auth.uid()));

-- 4. SERVERS POLICIES
-- Owners can see their own servers (Flat check)
CREATE POLICY "servers_view_owned" 
ON servers FOR SELECT 
USING (auth.uid() = owner_id);

-- Members can see servers they belong to. 
-- This uses a subquery on server_members which is now "flat" for the user.
CREATE POLICY "servers_view_member" 
ON servers FOR SELECT 
USING (
  id IN (
    SELECT server_id FROM server_members 
    WHERE profile_id = auth.uid()
  )
);

-- Owners can manage their servers
CREATE POLICY "servers_manage_owned" 
ON servers FOR ALL 
USING (auth.uid() = owner_id);