-- Update login_attempts table to match application requirements
ALTER TABLE login_attempts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Ensure indexes are optimized for the existing column names
CREATE INDEX IF NOT EXISTS idx_login_attempts_user_time ON login_attempts(user_id, attempt_time DESC);

-- Refresh RLS policies to be more explicit
DROP POLICY IF EXISTS "System can manage login attempts" ON login_attempts;
CREATE POLICY "Enable insert for everyone" ON login_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own login attempts" ON login_attempts FOR SELECT USING (auth.uid() = user_id);