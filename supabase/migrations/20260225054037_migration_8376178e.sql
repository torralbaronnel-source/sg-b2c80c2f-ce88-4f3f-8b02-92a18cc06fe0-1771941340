CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  coordinator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'Lead' CHECK (status IN ('Lead', 'Prospect', 'Active', 'Completed', 'Archived')),
  source TEXT DEFAULT 'Direct',
  notes TEXT,
  total_spent NUMERIC(12, 2) DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_followup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their server's clients"
  ON clients FOR SELECT
  USING (
    server_id = (SELECT current_server_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert clients in their server"
  ON clients FOR INSERT
  WITH CHECK (
    server_id = (SELECT current_server_id FROM profiles WHERE id = auth.uid())
    AND coordinator_id = auth.uid()
  );

CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  USING (
    coordinator_id = auth.uid()
    AND server_id = (SELECT current_server_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can delete their own clients"
  ON clients FOR DELETE
  USING (
    coordinator_id = auth.uid()
  );

CREATE INDEX idx_clients_server_id ON clients(server_id);
CREATE INDEX idx_clients_coordinator_id ON clients(coordinator_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);