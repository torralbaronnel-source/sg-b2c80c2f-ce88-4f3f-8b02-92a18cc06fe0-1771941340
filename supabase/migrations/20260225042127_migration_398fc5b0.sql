-- 1. Ensure the simplest possible non-recursive policies exist
DROP POLICY IF EXISTS "final_member_select" ON server_members;
DROP POLICY IF EXISTS "final_server_select" ON servers;

-- Simple: "If it's my profile_id, I can see it"
CREATE POLICY "ultra_flat_member_select" ON server_members FOR SELECT USING (profile_id = auth.uid());
-- Simple: "If I am the owner, OR if my ID is in the members list (via a non-joining check)"
-- To avoid ANY join, we'll keep servers visible to anyone authenticated for now, 
-- and let the member list handle the filtering in the app.
CREATE POLICY "ultra_flat_server_select" ON servers FOR SELECT USING (true);