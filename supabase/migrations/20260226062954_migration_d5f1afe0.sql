-- Create the AI Training Ledger Table
CREATE TABLE IF NOT EXISTS ai_training_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_query TEXT NOT NULL,
    kernel_resolution TEXT NOT NULL,
    intent_type TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE ai_training_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Admins can see all, Users can see their own (for future history features)
CREATE POLICY "Admins can view all training logs" ON ai_training_logs 
    FOR SELECT TO authenticated 
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('superadmin', 'admin')));

CREATE POLICY "Users can insert their own training logs" ON ai_training_logs 
    FOR INSERT TO authenticated 
    WITH CHECK (true);

-- Generate types automatically