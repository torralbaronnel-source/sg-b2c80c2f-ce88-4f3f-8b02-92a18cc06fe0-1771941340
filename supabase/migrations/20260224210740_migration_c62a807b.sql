-- 1. Manually create the missing profile for the existing user
INSERT INTO public.profiles (id, email, full_name)
VALUES ('bd4f52bd-9889-4d0a-8bf6-30cb7e2863b4', 'torralba.ronnel@gmail.com', 'Ronnel Torralba')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- 2. Ensure the trigger function is robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-attach the trigger just in case
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Fix RLS policies to allow the trigger (service role) to work
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;