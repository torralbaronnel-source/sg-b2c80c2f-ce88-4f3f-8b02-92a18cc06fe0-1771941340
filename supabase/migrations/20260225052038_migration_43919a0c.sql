-- Add indexes to speed up server switching and member lookups
    CREATE INDEX IF NOT EXISTS idx_profiles_current_server_id ON profiles(current_server_id);
    CREATE INDEX IF NOT EXISTS idx_server_members_profile_id ON server_members(profile_id);
    CREATE INDEX IF NOT EXISTS idx_server_members_server_id ON server_members(server_id);