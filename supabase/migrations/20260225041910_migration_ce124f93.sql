-- 1. DROP ALL POLICIES to ensure no hidden recursion remains
DROP POLICY IF EXISTS "atomic_member_select" ON server_members;
DROP POLICY IF EXISTS "atomic_member_insert" ON server_members;
DROP POLICY IF EXISTS "atomic_server_select" ON servers;
DROP POLICY IF EXISTS "atomic_server_insert" ON servers;
DROP POLICY IF EXISTS "server_member_access" ON server_members;
DROP POLICY IF EXISTS "Users can view their memberships" ON server_members;
DROP POLICY IF EXISTS "Users can join servers" ON server_members;
DROP POLICY IF EXISTS "atomic_member_access" ON server_members;
DROP POLICY IF EXISTS "atomic_server_access" ON servers;
DROP POLICY IF EXISTS "Users can create servers" ON servers;

-- 2. RE-ENABLE RLS (just in case)
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_members ENABLE ROW LEVEL SECURITY;

-- 3. CREATE ULTRA-SIMPLE ATOMIC POLICIES
-- server_members: Only allow user to see rows where profile_id is theirs
CREATE POLICY "final_member_select" ON server_members FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "final_member_insert" ON server_members FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "final_member_update" ON server_members FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "final_member_delete" ON server_members FOR DELETE USING (profile_id = auth.uid());

-- servers: Only allow user to see rows where owner_id is theirs
CREATE POLICY "final_server_select" ON servers FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "final_server_insert" ON servers FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "final_server_update" ON servers FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "final_server_delete" ON servers FOR DELETE USING (owner_id = auth.uid());