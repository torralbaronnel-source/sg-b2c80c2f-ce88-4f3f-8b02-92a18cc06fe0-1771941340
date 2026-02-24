ALTER TABLE event_vendors 
ADD COLUMN IF NOT EXISTS last_contact_at timestamp with time zone NULL,
ADD COLUMN IF NOT EXISTS response_status text NULL DEFAULT 'pending'::text;

ALTER TABLE event_vendors 
ADD CONSTRAINT event_vendors_response_status_check 
CHECK (response_status IN ('pending', 'responded', 'confirmed', 'issue'));