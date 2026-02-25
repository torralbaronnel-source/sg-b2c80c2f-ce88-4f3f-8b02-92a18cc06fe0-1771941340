CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  country TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  capacity INT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view venues in their server" ON venues
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create venues in their server" ON venues
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can update venues in their server" ON venues
  FOR UPDATE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can delete venues in their server" ON venues
  FOR DELETE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hmu', 'photo', 'video', 'lights', 'sound', 'decoration', 'catering', 'planning', 'coordination', 'styling', 'other')),
  base_price NUMERIC NOT NULL,
  duration INT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view services in their server" ON services
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create services in their server" ON services
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can update services in their server" ON services
  FOR UPDATE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can delete services in their server" ON services
  FOR DELETE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view packages in their server" ON packages
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create packages in their server" ON packages
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can update packages in their server" ON packages
  FOR UPDATE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can delete packages in their server" ON packages
  FOR DELETE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS package_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE package_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view package items" ON package_items
  FOR SELECT USING (package_id IN (SELECT id FROM packages WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('mua', 'stylist', 'photographer', 'videographer', 'coordinator', 'light_tech', 'sound_tech', 'decorator', 'caterer', 'other')),
  phone TEXT,
  email TEXT,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'on_leave')),
  rate_per_event NUMERIC,
  skills TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view staff in their server" ON staff
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create staff in their server" ON staff
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can update staff in their server" ON staff
  FOR UPDATE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can delete staff in their server" ON staff
  FOR DELETE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS staff_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  call_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE staff_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view staff assignments in their server" ON staff_assignments
  FOR SELECT USING (event_id IN (SELECT id FROM events WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('catering', 'flowers', 'lights', 'sound', 'decoration', 'transport', 'photography', 'videography', 'other')),
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  rating NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vendors in their server" ON vendors
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create vendors in their server" ON vendors
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can update vendors in their server" ON vendors
  FOR UPDATE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can delete vendors in their server" ON vendors
  FOR DELETE USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS event_vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  contract_amount NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE event_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view event vendors in their server" ON event_vendors
  FOR SELECT USING (event_id IN (SELECT id FROM events WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS event_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  sequence_order INT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE event_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view event timelines in their server" ON event_timeline
  FOR SELECT USING (event_id IN (SELECT id FROM events WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS event_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  price NUMERIC,
  quantity INT DEFAULT 1,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE event_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view event services in their server" ON event_services
  FOR SELECT USING (event_id IN (SELECT id FROM events WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  quote_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quotes in their server" ON quotes
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create quotes in their server" ON quotes
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity INT DEFAULT 1,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quote items in their server" ON quote_items
  FOR SELECT USING (quote_id IN (SELECT id FROM quotes WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid', 'overdue', 'cancelled')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invoices in their server" ON invoices
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create invoices in their server" ON invoices
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('gcash', 'bank_transfer', 'cash', 'card', 'check', 'other')),
  transaction_reference TEXT,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payments in their server" ON payments
  FOR SELECT USING (invoice_id IN (SELECT id FROM invoices WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  contract_number TEXT UNIQUE NOT NULL,
  file_url TEXT,
  signed_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contracts in their server" ON contracts
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create contracts in their server" ON contracts
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('contract', 'photo', 'video', 'inspiration', 'permit', 'document', 'other')),
  file_size INT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files in their server" ON files
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can upload files in their server" ON files
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks in their server" ON tasks
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create tasks in their server" ON tasks
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT,
  rsvp_status TEXT DEFAULT 'invited' CHECK (rsvp_status IN ('invited', 'accepted', 'declined', 'no_response')),
  seat_number INT,
  table_number INT,
  meal_preference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view guests in their server" ON guests
  FOR SELECT USING (event_id IN (SELECT id FROM events WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity_total INT NOT NULL,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'broken')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view equipment in their server" ON equipment
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Users can create equipment in their server" ON equipment
  FOR INSERT WITH CHECK (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE TABLE IF NOT EXISTS equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  return_status TEXT DEFAULT 'assigned' CHECK (return_status IN ('assigned', 'checked_out', 'returned', 'missing')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE equipment_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view equipment assignments in their server" ON equipment_assignments
  FOR SELECT USING (event_id IN (SELECT id FROM events WHERE server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid())));

CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sequence_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipeline stages in their server" ON pipeline_stages
  FOR SELECT USING (server_id = (SELECT profiles.current_server_id FROM profiles WHERE profiles.id = auth.uid()));

CREATE INDEX idx_venues_server ON venues(server_id);
CREATE INDEX idx_services_server ON services(server_id);
CREATE INDEX idx_packages_server ON packages(server_id);
CREATE INDEX idx_staff_server ON staff(server_id);
CREATE INDEX idx_staff_assignments_event ON staff_assignments(event_id);
CREATE INDEX idx_vendors_server ON vendors(server_id);
CREATE INDEX idx_event_vendors_event ON event_vendors(event_id);
CREATE INDEX idx_event_timeline_event ON event_timeline(event_id);
CREATE INDEX idx_event_services_event ON event_services(event_id);
CREATE INDEX idx_quotes_server ON quotes(server_id);
CREATE INDEX idx_quotes_client ON quotes(client_id);
CREATE INDEX idx_invoices_server ON invoices(server_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_contracts_server ON contracts(server_id);
CREATE INDEX idx_files_server ON files(server_id);
CREATE INDEX idx_tasks_server ON tasks(server_id);
CREATE INDEX idx_guests_event ON guests(event_id);
CREATE INDEX idx_equipment_server ON equipment(server_id);
CREATE INDEX idx_equipment_assignments_event ON equipment_assignments(event_id);