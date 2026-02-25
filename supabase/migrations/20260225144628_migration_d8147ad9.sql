-- 1. Create event_cues table (Master Run of Show)
CREATE TABLE IF NOT EXISTS event_cues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 5,
  title TEXT NOT NULL,
  description TEXT,
  cue_type TEXT DEFAULT 'program', -- program, av, catering, talent, internal
  status TEXT DEFAULT 'pending', -- pending, active, completed, overrun
  assigned_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enhance existing guests table for Live Check-in
-- We use DO blocks to safely add columns if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guests' AND column_name='attendance_status') THEN
    ALTER TABLE guests ADD COLUMN attendance_status TEXT DEFAULT 'waiting';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guests' AND column_name='is_vip') THEN
    ALTER TABLE guests ADD COLUMN is_vip BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guests' AND column_name='check_in_time') THEN
    ALTER TABLE guests ADD COLUMN check_in_time TIMESTAMP WITH TIME ZONE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guests' AND column_name='ticket_type') THEN
    ALTER TABLE guests ADD COLUMN ticket_type TEXT DEFAULT 'general';
  END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE event_cues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public select for event_cues" ON event_cues FOR SELECT USING (true);
CREATE POLICY "Authenticated all for event_cues" ON event_cues FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Generate types to sync with TS services