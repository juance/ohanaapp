
CREATE OR REPLACE FUNCTION public.create_user(
  user_name TEXT,
  user_phone TEXT,
  user_password TEXT,
  user_role TEXT DEFAULT 'client'
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  user_record RECORD;
BEGIN
  -- Insert new user
  INSERT INTO public.users (name, phone_number, password, role)
  VALUES (user_name, user_phone, user_password, user_role)
  RETURNING id INTO new_user_id;
  
  -- Get the created user details
  SELECT id, name, phone_number, email, role
  INTO user_record
  FROM public.users
  WHERE id = new_user_id;
  
  RETURN row_to_json(user_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
