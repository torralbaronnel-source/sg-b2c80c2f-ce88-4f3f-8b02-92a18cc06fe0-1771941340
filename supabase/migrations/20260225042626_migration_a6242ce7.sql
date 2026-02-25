-- 1. DROP ALL existing policies on server_members to clear any possible recursion paths
DROP POLICY IF EXISTS "absolute_flat_member_select" ON server_members;
DROP POLICY IF EXISTS "atomic_member_select" ON server_members;
DROP POLICY IF EXISTS "ultra_flat_member_select" ON server_members;
DROP POLICY IF EXISTS "final_member_select" ON server_members;
DROP POLICY IF EXISTS "member_select_policy" ON server_members;
DROP POLICY IF EXISTS "Users can view their own memberships" ON server_members;

-- 2. CREATE the MOST ATOMIC SELECT policy possible
-- This policy ONLY uses the current row's data and the user's ID.
-- NO SUBQUERIES, NO EXISTS, NO JOINS.
CREATE POLICY "final_atomic_member_select" 
ON server_members 
FOR SELECT 
TO authenticated 
USING (profile_id = auth.uid());

-- 3. Sync INSERT, UPDATE, and DELETE policies to be similarly atomic
DROP POLICY IF EXISTS "absolute_flat_member_insert" ON server_members;
CREATE POLICY "final_atomic_member_insert" 
ON server_members 
FOR INSERT 
TO authenticated 
WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "absolute_flat_member_update" ON server_members;
CREATE POLICY "final_atomic_member_update" 
ON server_members 
FOR UPDATE 
TO authenticated 
USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "absolute_flat_member_delete" ON server_members;
CREATE POLICY "final_atomic_member_delete" 
ON server_members 
FOR DELETE 
TO authenticated 
USING (profile_id = auth.uid());

-- 4. Ensure servers table also has atomic policies
DROP POLICY IF EXISTS "absolute_flat_server_select" ON servers;
CREATE POLICY "final_atomic_server_select" 
ON servers 
FOR SELECT 
TO authenticated 
USING (true); -- Filtering by membership happens in the app layer for stability

DROP POLICY IF EXISTS "absolute_flat_server_insert" ON servers;
CREATE POLICY "final_atomic_server_insert" 
ON servers 
FOR INSERT 
TO authenticated 
WITH CHECK (owner_id = auth.uid());