-- Add missing production fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS budget DECIMAL(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS guest_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS venue TEXT;

-- Update types