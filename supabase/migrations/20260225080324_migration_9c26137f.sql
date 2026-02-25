-- Add metadata column to nano_history
ALTER TABLE nano_history 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;