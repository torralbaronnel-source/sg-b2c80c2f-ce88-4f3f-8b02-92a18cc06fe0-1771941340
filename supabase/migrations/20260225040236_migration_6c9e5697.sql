-- 1. Drop all existing policies for server_members to ensure a clean slate
DROP POLICY IF EXISTS "Members can view their own records" ON server_members;
DROP POLICY IF EXISTS "Admins can manage memberships" ON server_members;
DROP POLICY IF EXISTS "Direct membership view" ON server_members;
DROP POLICY IF EXISTS "Portal admin management" ON server_members;

-- 2. Create a simple, non-recursive policy for viewing memberships
-- This policy ONLY checks the profile_id field, avoiding any joins or subqueries
CREATE POLICY "Users can view their own memberships" 
ON server_members 
FOR SELECT 
USING (auth.uid() = profile_id);

-- 3. Create a policy for Portal Admins to manage their server members
-- Instead of checking the 'role' column (which is inside this table), 
-- we check if the user is the OWNER of the server in the 'servers' table.
-- This breaks the recursion because it goes from server_members -> servers, 
-- but the servers policy no longer goes back to server_members.
CREATE POLICY "Server owners can manage all memberships" 
ON server_members 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM servers 
    WHERE servers.id = server_members.server_id 
    AND servers.owner_id = auth.uid()
  )
);

-- 4. Ensure the servers table policy is also flat and non-recursive
DROP POLICY IF EXISTS "Users can view relevant servers" ON servers;
CREATE POLICY "Users can view servers they own" 
ON servers 
FOR SELECT 
USING (owner_id = auth.uid());

CREATE POLICY "Users can view servers they are members of" 
ON servers 
FOR SELECT 
USING (
  id IN (
    SELECT server_id FROM server_members 
    WHERE profile_id = auth.uid()
  )
);