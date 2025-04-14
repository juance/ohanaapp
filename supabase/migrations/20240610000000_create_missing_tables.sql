-- Create missing tables for Ohana Laundry App
-- This migration creates all the tables that are missing in the database

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  loyalty_points INTEGER DEFAULT 0,
  valets_count INTEGER DEFAULT 0,
  free_valets INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ticket_sequence table
CREATE TABLE IF NOT EXISTS public.ticket_sequence (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_number INTEGER DEFAULT 0
);

-- Insert initial ticket sequence if not exists
INSERT INTO public.ticket_sequence (id, last_number)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ready',
  date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_paid BOOLEAN DEFAULT false,
  is_canceled BOOLEAN DEFAULT false,
  valet_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  basket_ticket_number TEXT,
  delivered_date TIMESTAMP WITH TIME ZONE
);

-- Create dry_cleaning_items table
CREATE TABLE IF NOT EXISTS public.dry_cleaning_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ticket_laundry_options table
CREATE TABLE IF NOT EXISTS public.ticket_laundry_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to get next ticket number
CREATE OR REPLACE FUNCTION public.get_next_ticket_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
BEGIN
  -- Update the sequence and return the new value
  UPDATE public.ticket_sequence
  SET last_number = last_number + 1
  WHERE id = 1
  RETURNING last_number INTO next_number;
  
  -- Format the number with leading zeros (8 digits)
  RETURN LPAD(next_number::TEXT, 8, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to reset ticket sequence
CREATE OR REPLACE FUNCTION public.reset_ticket_sequence()
RETURNS VOID AS $$
BEGIN
  -- Reset the sequence to 0
  UPDATE public.ticket_sequence
  SET last_number = 0
  WHERE id = 1;
  
  -- Log the reset
  INSERT INTO public.ticket_sequence_resets (reset_by, notes)
  VALUES ('system', 'Sequence reset via function call');
EXCEPTION
  WHEN undefined_table THEN
    -- Create the resets table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.ticket_sequence_resets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reset_by TEXT NOT NULL,
      notes TEXT,
      reset_date TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Try again
    INSERT INTO public.ticket_sequence_resets (reset_by, notes)
    VALUES ('system', 'Sequence reset via function call');
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON public.tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_dry_cleaning_items_ticket_id ON public.dry_cleaning_items(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_laundry_options_ticket_id ON public.ticket_laundry_options(ticket_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
