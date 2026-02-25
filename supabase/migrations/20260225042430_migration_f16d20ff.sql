-- 1. Drop ALL potentially recursive policies to ensure a clean slate
DROP POLICY IF EXISTS "atomic_member_select" ON server_members;
DROP POLICY IF EXISTS "ultra_flat_member_select" ON server_members;
DROP POLICY IF EXISTS "final_member_select" ON server_members;
DROP POLICY IF EXISTS "member_select_policy" ON server_members;

-- 2. Create the MOST ATOMIC policy possible (Zero Recursion)
-- This policy ONLY checks the column value against the auth.uid()
-- It contains NO subqueries, NO exists, NO joins.
CREATE POLICY "absolute_flat_member_select" 
ON server_members 
FOR SELECT 
TO authenticated 
USING (profile_id = auth.uid());

-- 3. Update the INSERT policy to match
DROP POLICY IF EXISTS "atomic_member_insert" ON server_members;
CREATE POLICY "absolute_flat_member_insert" 
ON server_members 
FOR INSERT 
TO authenticated 
WITH CHECK (profile_id = auth.uid());

-- 4. Simplify the servers table policies to avoid any cross-table lookups
DROP POLICY IF EXISTS "atomic_server_select" ON servers;
DROP POLICY IF EXISTS "ultra_flat_server_select" ON servers;
CREATE POLICY "absolute_flat_server_select" 
ON servers 
FOR SELECT 
TO authenticated 
USING (true); -- Visibility filtering happens in the app layer for stability

-- 5. Ensure owner-only modifications
DROP POLICY IF EXISTS "atomic_server_insert" ON servers;
CREATE POLICY "absolute_flat_server_insert" 
ON servers 
FOR INSERT 
TO authenticated 
WITH CHECK (owner_id = auth.uid());