
CREATE OR REPLACE FUNCTION public.get_user_by_phone(phone TEXT)
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT id, name, phone_number, email, password, role
  INTO user_record
  FROM public.users
  WHERE phone_number = phone
  LIMIT 1;
  
  IF user_record IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN row_to_json(user_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
