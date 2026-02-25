-- Add reports_to column to profiles for the Org Chart functionality
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'reports_to') THEN
        ALTER TABLE profiles ADD COLUMN reports_to UUID REFERENCES profiles(id);
      END IF;
    END $$;

    -- Add bio and cover_url for enriched profiles
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'cover_url') THEN
        ALTER TABLE profiles ADD COLUMN cover_url TEXT;
      END IF;
    END $$;