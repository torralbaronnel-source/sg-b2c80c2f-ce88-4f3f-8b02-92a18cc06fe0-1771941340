-- 1. Run-of-Show / Timeline Items
CREATE TABLE IF NOT EXISTS run_of_show (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  responsible_team TEXT, -- e.g., 'Photography', 'Catering', 'AV'
  dependencies JSONB DEFAULT '[]', -- List of other item IDs
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Delayed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Resource Allocations (Crew & Gear)
CREATE TABLE IF NOT EXISTS resource_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('Crew', 'Equipment', 'Vehicle')),
  resource_name TEXT NOT NULL,
  role_or_purpose TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'Assigned',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Call Sheets
CREATE TABLE IF NOT EXISTS call_sheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  general_call_time TEXT,
  parking_info TEXT,
  nearest_hospital TEXT,
  weather_forecast JSONB,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all new tables
ALTER TABLE run_of_show ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sheets ENABLE ROW LEVEL SECURITY;

-- Standard Policies
CREATE POLICY "Users can manage their event data" ON run_of_show FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their event resources" ON resource_allocations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their call sheets" ON call_sheets FOR ALL USING (auth.uid() IS NOT NULL);