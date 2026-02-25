-- 1. Update Events RLS Policies for Server Isolation
DROP POLICY IF EXISTS "Users can view their own events" ON events;
CREATE POLICY "Users can view events in active server" ON events 
FOR SELECT USING (
  auth.uid() = coordinator_id AND 
  server_id = (SELECT current_server_id FROM profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert their own events" ON events;
CREATE POLICY "Users can insert events in active server" ON events 
FOR INSERT WITH CHECK (
  auth.uid() = coordinator_id AND 
  server_id = (SELECT current_server_id FROM profiles WHERE id = auth.uid())
);

-- 2. Update Communications RLS Policies for Server Isolation
DROP POLICY IF EXISTS "Users can view their own communications" ON communications;
CREATE POLICY "Users can view communications in active server" ON communications 
FOR SELECT USING (
  auth.uid() = coordinator_id AND 
  server_id = (SELECT current_server_id FROM profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Users can insert their own communications" ON communications;
CREATE POLICY "Users can insert communications in active server" ON communications 
FOR INSERT WITH CHECK (
  auth.uid() = coordinator_id AND 
  server_id = (SELECT current_server_id FROM profiles WHERE id = auth.uid())
);

-- 3. Ensure profiles.current_server_id is kept in sync with the app's selected server
-- This helps RLS policies work even if localStorage is cleared or on different devices