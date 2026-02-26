-- Create itineraries table with correct PostgreSQL syntax
CREATE TABLE IF NOT EXISTS public.itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  status TEXT DEFAULT 'Planning' CHECK (status IN ('Planning', 'Confirmed', 'Live', 'Completed', 'Cancelled')),
  category TEXT DEFAULT 'General' CHECK (category IN ('General', 'Main Event', 'Logistics', 'VIP', 'Setup', 'Teardown')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies with correct OR syntax
DROP POLICY IF EXISTS "Users can view itineraries in their server" ON public.itineraries;
CREATE POLICY "Users can view itineraries in their server" ON public.itineraries
FOR SELECT USING (
  event_id IN (
    SELECT e.id FROM public.events e
    JOIN public.profiles p ON p.current_server_id = e.server_id
    WHERE p.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage itineraries" ON public.itineraries;
CREATE POLICY "Users can manage itineraries" ON public.itineraries
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'super_admin' OR role = 'admin' OR role = 'coordinator')
  )
);

-- Add to app_pages for permission tracking
INSERT INTO public.app_pages (name, route, module, description)
VALUES ('Itineraries', '/itineraries', 'Events', 'Master event schedules and timing nodes')
ON CONFLICT (route) DO NOTHING;