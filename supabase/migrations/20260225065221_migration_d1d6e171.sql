-- Add lifecycle columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS current_stage TEXT DEFAULT 'Client';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS lifecycle_history JSONB DEFAULT '[]';

-- Add status tracking to events for the Production -> Delivery -> Billing flow
ALTER TABLE events ADD COLUMN IF NOT EXISTS production_status TEXT DEFAULT 'Planning';
ALTER TABLE events ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'Pending';
ALTER TABLE events ADD COLUMN IF NOT EXISTS billing_status TEXT DEFAULT 'Unpaid';