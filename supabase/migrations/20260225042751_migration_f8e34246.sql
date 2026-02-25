-- 1. DROP EVERY SINGLE POLICY on these tables to ensure a absolute clean slate
-- We drop by name, including all previous variations we tried
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'server_members') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON server_members', pol.policyname);
    END LOOP;
    
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'servers') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON servers', pol.policyname);
    END LOOP;
END $$;

-- 2. CREATE THE MOST ATOMIC POLICIES POSSIBLE
-- For server_members: Only allow users to see rows where profile_id matches their ID.
-- We use a direct column comparison which is non-recursive.
CREATE POLICY "atomic_select_v1" ON server_members FOR SELECT TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "atomic_insert_v1" ON server_members FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "atomic_update_v1" ON server_members FOR UPDATE TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "atomic_delete_v1" ON server_members FOR DELETE TO authenticated USING (profile_id = auth.uid());

-- For servers: Allow all authenticated users to read. 
-- Filtering which servers a user "belongs to" is handled by the app logic and the server_members check.
CREATE POLICY "atomic_server_select_v1" ON servers FOR SELECT TO authenticated USING (true);
CREATE POLICY "atomic_server_insert_v1" ON servers FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "atomic_server_update_v1" ON servers FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "atomic_server_delete_v1" ON servers FOR DELETE TO authenticated USING (owner_id = auth.uid());

-- 3. Verify RLS is enabled
ALTER TABLE server_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;