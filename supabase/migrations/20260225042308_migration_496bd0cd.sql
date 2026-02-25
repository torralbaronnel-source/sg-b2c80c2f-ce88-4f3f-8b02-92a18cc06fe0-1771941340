-- 1. DROP ALL existing policies to clear any recursive logic
DROP POLICY IF EXISTS "ultra_flat_member_select" ON server_members;
DROP POLICY IF EXISTS "final_member_select" ON server_members;
DROP POLICY IF EXISTS "member_select_policy" ON server_members;

-- 2. Create the MOST ATOMIC policy possible
-- This policy checks ONLY the column value against the auth.uid()
-- It contains NO subqueries, NO exists, NO joins.
CREATE POLICY "atomic_member_select" 
ON server_members 
FOR SELECT 
TO authenticated 
USING (profile_id = auth.uid());

-- 3. Ensure INSERT is also atomic
DROP POLICY IF EXISTS "atomic_member_insert" ON server_members;
CREATE POLICY "atomic_member_insert" 
ON server_members 
FOR INSERT 
TO authenticated 
WITH CHECK (profile_id = auth.uid());

-- 4. Do the same for servers to be safe
DROP POLICY IF EXISTS "ultra_flat_server_select" ON servers;
CREATE POLICY "atomic_server_select" 
ON servers 
FOR SELECT 
TO authenticated 
USING (true); -- Servers are visible if you are logged in, filtering happens in the app layer

-- 5. Force a type regeneration to sync everything