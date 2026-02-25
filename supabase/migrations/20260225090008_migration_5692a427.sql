-- 1. Ensure columns exist (this part was successful before, but good to keep)
    ALTER TABLE communications 
    ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'direct',
    ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
    ADD COLUMN IF NOT EXISTS pinned_message_id UUID;

    ALTER TABLE whatsapp_messages
    ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES whatsapp_messages(id);

    -- 2. Create sample channels with VALID platform values
    DO $$
    DECLARE
        v_server_id UUID;
        v_profile_id UUID;
    BEGIN
        SELECT id, current_server_id INTO v_profile_id, v_server_id FROM profiles LIMIT 1;
        
        IF v_server_id IS NOT NULL AND v_profile_id IS NOT NULL THEN
            -- Channel 1: Production (Platform must be one of: WhatsApp, SMS, Email, Call, Portal)
            INSERT INTO communications (contact_name, coordinator_id, server_id, type, category, last_message, platform, status)
            VALUES ('General Logistics', v_profile_id, v_server_id, 'channel', 'Production', 'Welcome to the logistics channel.', 'WhatsApp', 'Active')
            ON CONFLICT DO NOTHING;
            
            -- Channel 2: Vendors
            INSERT INTO communications (contact_name, coordinator_id, server_id, type, category, last_message, platform, status)
            VALUES ('Catering Coordination', v_profile_id, v_server_id, 'channel', 'Vendors', 'Menu has been finalized.', 'WhatsApp', 'Active')
            ON CONFLICT DO NOTHING;
        END IF;
    END $$;