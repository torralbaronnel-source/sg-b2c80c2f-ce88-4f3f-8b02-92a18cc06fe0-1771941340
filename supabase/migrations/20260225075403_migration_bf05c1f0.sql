-- Create nano_history table
CREATE TABLE IF NOT EXISTS nano_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE nano_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own nano history" ON nano_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own nano history" ON nano_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_nano_history_user_time ON nano_history(user_id, executed_at DESC);