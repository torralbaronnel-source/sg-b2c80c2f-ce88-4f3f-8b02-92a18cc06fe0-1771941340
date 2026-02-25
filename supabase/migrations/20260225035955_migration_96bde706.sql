-- 1. Reset all problematic policies for a clean state
DROP POLICY IF EXISTS "Users can view servers they are members of" ON servers;
DROP POLICY IF EXISTS "Users can view their own membership" ON server_members;
DROP POLICY IF EXISTS "Members can view fellow server members" ON server_members;
DROP POLICY IF EXISTS "Server owners can manage all members" ON server_members;
DROP POLICY IF EXISTS "Portal admins can manage their server" ON server_members;

-- 2. Non-Recursive Policies for SERVERS
-- A user can see a server if they OWN it (direct field check, no recursion)
CREATE POLICY "Owners can view their servers" ON servers
  FOR SELECT USING (owner_id = auth.uid());

-- A user can see a server if they are IN it (we use a simple subquery on server_members)
CREATE POLICY "Members can view their servers" ON servers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM server_members 
      WHERE server_members.server_id = servers.id 
      AND server_members.profile_id = auth.uid()
    )
  );

-- 3. Non-Recursive Policies for SERVER_MEMBERS
-- A user can see their own membership record (direct check)
CREATE POLICY "Self view membership" ON server_members
  FOR SELECT USING (profile_id = auth.uid());

-- A user can see other members in a server they belong to
-- We avoid querying 'servers' here to prevent the loop back
CREATE POLICY "Server member visibility" ON server_members
  FOR SELECT USING (
    server_id IN (
      SELECT sm.server_id 
      FROM server_members sm 
      WHERE sm.profile_id = auth.uid()
    )
  );

-- Management permissions (Insert/Update/Delete)
CREATE POLICY "Admin management" ON server_members
  FOR ALL USING (
    profile_id = auth.uid() OR
    role = 'portal_admin'
  );