-- 1. Add INSERT policies for servers
-- Allow authenticated users to create servers (they become the owner)
CREATE POLICY "Users can create servers" ON servers 
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 2. Add INSERT policies for server_members
-- Allow users to add themselves to a server (if they have the invite code logic in app)
CREATE POLICY "Users can join servers" ON server_members 
FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 3. Update UPDATE policy for profiles to allow setting current_server_id
-- This is already covered by "Users can update own profile", but we'll ensure it's clear.