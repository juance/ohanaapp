-- Script para crear todas las tablas necesarias en la base de datos
-- Este script se puede ejecutar directamente en la consola SQL de Supabase

-- Crear la tabla customers
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

-- Crear la tabla ticket_sequence
CREATE TABLE IF NOT EXISTS public.ticket_sequence (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_number INTEGER DEFAULT 0
);

-- Insertar el valor inicial en ticket_sequence
INSERT INTO public.ticket_sequence (id, last_number)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Crear la tabla tickets
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

-- Crear la tabla dry_cleaning_items
CREATE TABLE IF NOT EXISTS public.dry_cleaning_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear la tabla ticket_laundry_options
CREATE TABLE IF NOT EXISTS public.ticket_laundry_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear la función get_next_ticket_number
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

-- Crear la función reset_ticket_sequence
CREATE OR REPLACE FUNCTION public.reset_ticket_sequence()
RETURNS VOID AS $$
BEGIN
  -- Reset the sequence to 0
  UPDATE public.ticket_sequence
  SET last_number = 0
  WHERE id = 1;
  
  -- Create the resets table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.ticket_sequence_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reset_by TEXT NOT NULL,
    notes TEXT,
    reset_date TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  
  -- Log the reset
  INSERT INTO public.ticket_sequence_resets (reset_by, notes)
  VALUES ('system', 'Sequence reset via function call');
END;
$$ LANGUAGE plpgsql;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON public.tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_dry_cleaning_items_ticket_id ON public.dry_cleaning_items(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_laundry_options_ticket_id ON public.ticket_laundry_options(ticket_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- Verificar que las tablas se hayan creado correctamente
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('customers', 'tickets', 'dry_cleaning_items', 'ticket_laundry_options', 'ticket_sequence');

-- Verificar que las funciones se hayan creado correctamente
SELECT proname FROM pg_proc 
WHERE proname IN ('get_next_ticket_number', 'reset_ticket_sequence') 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
