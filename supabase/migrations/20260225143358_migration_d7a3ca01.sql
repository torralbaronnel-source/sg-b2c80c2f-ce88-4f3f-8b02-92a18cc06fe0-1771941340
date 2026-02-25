-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sku TEXT UNIQUE,
  status TEXT DEFAULT 'available', -- available, in-use, maintenance, retired
  quantity INTEGER DEFAULT 1,
  location TEXT,
  last_maintenance_date TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own assets" ON assets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own assets" ON assets FOR ALL USING (auth.uid() = user_id);

-- Add sample data for the preview
INSERT INTO assets (name, category, sku, status, quantity, location, user_id)
SELECT 'MacBook Pro 16"', 'Hardware', 'LAP-001', 'available', 5, 'Main Office', id FROM auth.users LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO assets (name, category, sku, status, quantity, location, user_id)
SELECT 'Canon EOS R5', 'Photography', 'CAM-042', 'in-use', 2, 'Venue A', id FROM auth.users LIMIT 1
ON CONFLICT DO NOTHING;