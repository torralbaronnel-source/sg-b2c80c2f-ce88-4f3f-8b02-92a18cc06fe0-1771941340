-- Create Private Concierge Requests table
CREATE TABLE private_concierge_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    request_type TEXT NOT NULL CHECK (request_type IN ('Private Demo', 'Business Consultation', 'Portal Customization')),
    interested_modules TEXT[] DEFAULT '{}',
    customization_details TEXT,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Scheduled', 'In Progress', 'Completed', 'Archived')),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'VIP')),
    user_id UUID REFERENCES auth.users(id), -- Optional: if requester is logged in
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE private_concierge_requests ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Anyone can insert (to allow public demo requests)
CREATE POLICY "Anyone can request a demo" ON private_concierge_requests 
FOR INSERT WITH CHECK (true);

-- 2. Only users with 'admin' or 'super_admin' role can view/edit
-- We check this via the profiles table
CREATE POLICY "Admins can view all requests" ON private_concierge_requests
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'super_admin' OR profiles.role = 'admin')
    )
);

CREATE POLICY "Admins can update requests" ON private_concierge_requests
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'super_admin' OR profiles.role = 'admin')
    )
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_concierge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER tr_update_concierge_updated_at
    BEFORE UPDATE ON private_concierge_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_concierge_updated_at();