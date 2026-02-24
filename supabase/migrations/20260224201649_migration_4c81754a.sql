-- Table to track login attempts for brute force prevention
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address TEXT,
  attempt_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  success BOOLEAN DEFAULT FALSE
);

-- Index for quick lookups on recent attempts
CREATE INDEX IF NOT EXISTS idx_login_attempts_email_time ON login_attempts(email, attempt_time DESC);

-- RLS for login_attempts (internal use mostly)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System can manage login attempts" ON login_attempts FOR ALL USING (true);