-- 1. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Members can view their fellow members" ON server_members;
DROP POLICY IF EXISTS "Portal Admins can manage members" ON server_members;

-- 2. Re-implement non-recursive policies for server_members
-- Basic view policy: A user can see their own membership
CREATE POLICY "Users can view their own membership" ON server_members
  FOR SELECT USING (profile_id = auth.uid());

-- Advanced view policy: Users can see fellow members IF they are already a member
-- We use a subquery that targets the profile_id directly to avoid recursion
CREATE POLICY "Members can view fellow server members" ON server_members
  FOR SELECT USING (
    server_id IN (
      SELECT sm.server_id 
      FROM server_members sm 
      WHERE sm.profile_id = auth.uid()
    )
  );

-- Management policy: Only the server owner or a designated portal_admin can manage
CREATE POLICY "Server owners can manage all members" ON server_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM servers s 
      WHERE s.id = server_members.server_id 
      AND s.owner_id = auth.uid()
    )
  );

-- Portal Admin management (separate to keep it clean)
CREATE POLICY "Portal admins can manage their server" ON server_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM server_members sm
      WHERE sm.server_id = server_members.server_id
      AND sm.profile_id = auth.uid()
      AND sm.role = 'portal_admin'
    )
  );

-- 3. Ensure servers table also has clean policies
DROP POLICY IF EXISTS "Users can view servers they are members of" ON servers;
CREATE POLICY "Users can view servers they are members of" ON servers
  FOR SELECT USING (
    owner_id = auth.uid() OR
    id IN (SELECT server_id FROM server_members WHERE profile_id = auth.uid())
  );