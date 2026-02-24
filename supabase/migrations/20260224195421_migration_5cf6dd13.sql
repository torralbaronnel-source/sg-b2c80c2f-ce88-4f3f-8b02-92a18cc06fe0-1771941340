-- 1. Create Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coordinator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'Confirmed', 'Live', 'Completed', 'Cancelled')),
  package_type TEXT,
  budget NUMERIC(12,2) DEFAULT 0,
  description TEXT,
  call_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = coordinator_id);
CREATE POLICY "Users can insert their own events" ON events FOR INSERT WITH CHECK (auth.uid() = coordinator_id);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = coordinator_id);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = coordinator_id);

-- 2. Create Communications Table (for the unified hub)
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coordinator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL,
  contact_type TEXT DEFAULT 'Vendor' CHECK (contact_type IN ('Client', 'Vendor', 'Staff')),
  platform TEXT NOT NULL CHECK (platform IN ('WhatsApp', 'Slack', 'Email')),
  last_message TEXT,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived')),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Communications
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own communications" ON communications FOR SELECT USING (auth.uid() = coordinator_id);
CREATE POLICY "Users can insert their own communications" ON communications FOR INSERT WITH CHECK (auth.uid() = coordinator_id);
CREATE POLICY "Users can update their own communications" ON communications FOR UPDATE USING (auth.uid() = coordinator_id);
CREATE POLICY "Users can delete their own communications" ON communications FOR DELETE USING (auth.uid() = coordinator_id);

-- 3. Create WhatsApp Messages Table (for the WhatsApp Manager)
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_from_me BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for WhatsApp Messages
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages through communications" ON whatsapp_messages FOR SELECT 
USING (EXISTS (SELECT 1 FROM communications WHERE id = whatsapp_messages.communication_id AND coordinator_id = auth.uid()));

CREATE POLICY "Users can insert messages through communications" ON whatsapp_messages FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM communications WHERE id = whatsapp_messages.communication_id AND coordinator_id = auth.uid()));

-- 4. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON communications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();