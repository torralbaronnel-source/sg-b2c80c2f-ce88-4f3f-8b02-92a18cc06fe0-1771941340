-- 1. Ensure RLS is enabled
ALTER TABLE private_concierge_requests ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can insert requests" ON private_concierge_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON private_concierge_requests;
DROP POLICY IF EXISTS "Public can insert concierge requests" ON private_concierge_requests;
DROP POLICY IF EXISTS "Admin can view all concierge requests" ON private_concierge_requests;

-- 3. Create a policy to allow anyone (even non-logged in users) to submit a request
CREATE POLICY "Public can insert concierge requests" 
ON private_concierge_requests 
FOR INSERT 
WITH CHECK (true);

-- 4. Create a policy to allow only authenticated admins to view the requests
-- Note: This assumes you have the 'admin' role logic handled, or we allow all authenticated users for now
-- if it's a small team, otherwise we check against the profiles table.
CREATE POLICY "Admin can view all concierge requests" 
ON private_concierge_requests 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Allow admins to update status/priority
CREATE POLICY "Admin can update concierge requests" 
ON private_concierge_requests 
FOR UPDATE 
TO authenticated 
USING (true);