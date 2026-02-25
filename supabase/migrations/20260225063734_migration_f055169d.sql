-- Add type column to events table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='type') THEN
        ALTER TABLE events ADD COLUMN type TEXT DEFAULT 'Wedding';
    END IF;
END $$;

-- Update existing events to have a default type if they are null
UPDATE events SET type = 'Wedding' WHERE type IS NULL;