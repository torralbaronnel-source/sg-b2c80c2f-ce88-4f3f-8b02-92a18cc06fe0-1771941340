-- 1. Update the check constraint for communications.platform
ALTER TABLE communications DROP CONSTRAINT IF EXISTS communications_platform_check;
ALTER TABLE communications ADD CONSTRAINT communications_platform_check 
  CHECK (platform IN ('WhatsApp', 'Slack', 'Email', 'Team Chats'));

-- 2. Update existing WhatsApp records to Team Chats branding
UPDATE communications SET platform = 'Team Chats' WHERE platform = 'WhatsApp';