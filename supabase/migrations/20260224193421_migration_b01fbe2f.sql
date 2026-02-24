-- Fix infinite recursion in organization_members policy
DROP POLICY IF EXISTS "Members can view their own organizations" ON organization_members;
DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;

-- Use a safer policy that avoids recursion by checking auth.uid directly 
-- or using a subquery that doesn't trigger the same policy
CREATE POLICY "Users can view their own membership" 
ON organization_members FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view other members in same organization" 
ON organization_members FOR SELECT 
USING (
  organization_id IN (
    SELECT org_id FROM (
      SELECT organization_id as org_id FROM organization_members WHERE user_id = auth.uid()
    ) as subquery
  )
);

-- Ensure profiles exist for existing users to avoid 406 errors
INSERT INTO profiles (id, email, full_name)
SELECT id, email, email as full_name
FROM auth.users
ON CONFLICT (id) DO NOTHING;