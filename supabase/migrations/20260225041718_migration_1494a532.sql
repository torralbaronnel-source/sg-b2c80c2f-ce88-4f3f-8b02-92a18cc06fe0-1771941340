-- 1. Drop ALL existing policies for server_members to ensure a clean slate
DROP POLICY IF EXISTS "server_member_access" ON server_members;
DROP POLICY IF EXISTS "Users can view their memberships" ON server_members;
DROP POLICY IF EXISTS "Users can join servers" ON server_members;
DROP POLICY IF EXISTS "atomic_member_access" ON server_members;

-- 2. Create a PURE ATOMIC policy for SELECT
-- This only checks the row's profile_id against the current user. 
-- NO subqueries, NO joins, NO recursion possible.
CREATE POLICY "atomic_member_select" ON server_members 
FOR SELECT USING (profile_id = auth.uid());

-- 3. Create a PURE ATOMIC policy for INSERT
CREATE POLICY "atomic_member_insert" ON server_members 
FOR INSERT WITH CHECK (profile_id = auth.uid());

-- 4. Ensure servers table is also atomic to prevent the join from looping
DROP POLICY IF EXISTS "atomic_server_access" ON servers;
DROP POLICY IF EXISTS "Users can create servers" ON servers;

CREATE POLICY "atomic_server_select" ON servers 
FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "atomic_server_insert" ON servers 
FOR INSERT WITH CHECK (owner_id = auth.uid());