-- Create a webhook trigger to assign demo roles after user creation
CREATE OR REPLACE FUNCTION public.handle_demo_role_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Make HTTP request to edge function to assign roles based on email
  PERFORM
    net.http_post(
      url := 'https://mlqnwfrxkxwubnvcqhrt.supabase.co/functions/v1/assign-demo-roles',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object('record', row_to_json(NEW))::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function after user creation
DROP TRIGGER IF EXISTS on_auth_user_demo_role_assignment ON auth.users;
CREATE TRIGGER on_auth_user_demo_role_assignment
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_demo_role_assignment();