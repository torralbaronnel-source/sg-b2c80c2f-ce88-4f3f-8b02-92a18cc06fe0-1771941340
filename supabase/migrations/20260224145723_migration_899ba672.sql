ALTER TABLE messages 
ADD COLUMN direction text DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
ADD COLUMN status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
ADD COLUMN vendor_id uuid REFERENCES event_vendors(id) ON DELETE CASCADE;