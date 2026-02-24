-- Add the comprehensive event details columns
    ALTER TABLE events 
    ADD COLUMN IF NOT EXISTS hmu_artist TEXT,
    ADD COLUMN IF NOT EXISTS lights_sounds TEXT,
    ADD COLUMN IF NOT EXISTS catering TEXT,
    ADD COLUMN IF NOT EXISTS photo_video TEXT,
    ADD COLUMN IF NOT EXISTS coordination_team TEXT,
    ADD COLUMN IF NOT EXISTS backdrop_styling TEXT,
    ADD COLUMN IF NOT EXISTS souvenirs TEXT,
    ADD COLUMN IF NOT EXISTS host_mc TEXT,
    ADD COLUMN IF NOT EXISTS event_notes TEXT;

    -- Update the events table to ensure status defaults to 'planning' if not provided
    ALTER TABLE events ALTER COLUMN status SET DEFAULT 'planning';