-- 1. Add the role column to profiles if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'coordinator';
    END IF;
END $$;

-- 2. Update existing profiles to have a role if they are null
UPDATE public.profiles SET role = 'coordinator' WHERE role IS NULL;