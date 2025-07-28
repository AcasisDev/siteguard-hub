-- Insert demo user roles for testing
-- Note: These user IDs would be created by Supabase Auth when users sign up
-- For now, let's create some sample role assignments for common email patterns

-- First, let's create a function to easily assign roles (for superadmins)
CREATE OR REPLACE FUNCTION public.assign_user_role(user_email TEXT, new_role app_role)
RETURNS void AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from auth.users based on email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Delete existing role for this user (if any)
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    
    -- Insert new role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, new_role);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to automatically assign viewer role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign viewer role by default to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign viewer role to new signups
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();