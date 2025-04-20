-- Corrección de la función get_next_ticket_number para asegurar incremento de 1 en 1
CREATE OR REPLACE FUNCTION public.get_next_ticket_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  current_number INTEGER;
BEGIN
  -- Get the current value first
  SELECT last_number INTO current_number
  FROM public.ticket_sequence
  WHERE id = 1;
  
  -- Calculate the next number (ensure it's always +1 from the last used number)
  next_number := current_number + 1;
  
  -- Update the sequence with the new value
  UPDATE public.ticket_sequence
  SET last_number = next_number
  WHERE id = 1;
  
  -- Format the number with leading zeros (8 digits)
  RETURN LPAD(next_number::TEXT, 8, '0');
END;
$$ LANGUAGE plpgsql;
