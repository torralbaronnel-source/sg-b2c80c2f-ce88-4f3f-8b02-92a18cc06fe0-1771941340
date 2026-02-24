CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  client_name TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE event_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL CHECK (vendor_type IN ('catering', 'photography', 'florist', 'music', 'venue', 'decoration', 'other')),
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'slack', 'email', 'call')),
  sender_name TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'vendor', 'coordinator', 'team')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'call')),
  external_id TEXT, -- ID from external platform
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for events
CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for event_vendors
CREATE POLICY "Users can view vendors for their events" ON event_vendors FOR SELECT USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Users can add vendors to their events" ON event_vendors FOR INSERT WITH CHECK (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Users can update vendors for their events" ON event_vendors FOR UPDATE USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Users can delete vendors from their events" ON event_vendors FOR DELETE USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages for their events" ON messages FOR SELECT USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Users can create messages for their events" ON messages FOR INSERT WITH CHECK (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Users can update messages for their events" ON messages FOR UPDATE USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);
CREATE POLICY "Users can delete messages for their events" ON messages FOR DELETE USING (
  event_id IN (SELECT id FROM events WHERE created_by = auth.uid())
);