CREATE TABLE IF NOT EXISTS role_analytics_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  selected_roles TEXT[] NOT NULL DEFAULT '{}',
  selected_modules TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE role_analytics_presets ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can manage their own presets"
ON role_analytics_presets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);