-- Ensure all required tables exist and have the correct structure

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  loyalty_points INTEGER DEFAULT 0,
  free_valets INTEGER DEFAULT 0,
  valets_count INTEGER DEFAULT 0,
  valets_redeemed INTEGER DEFAULT 0,
  last_visit TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on phone for faster lookups
CREATE INDEX IF NOT EXISTS customers_phone_idx ON public.customers (phone);

-- Tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL,
  basket_ticket_number INTEGER,
  customer_id UUID REFERENCES public.customers(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'delivered')),
  total NUMERIC(10, 2) DEFAULT 0,
  payment_method TEXT CHECK (payment_method IN ('cash', 'debit', 'mercadopago', 'cuentadni')),
  is_paid BOOLEAN DEFAULT false,
  is_canceled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for tickets
CREATE INDEX IF NOT EXISTS tickets_customer_id_idx ON public.tickets (customer_id);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON public.tickets (status);
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON public.tickets (created_at);

-- Dry cleaning items table
CREATE TABLE IF NOT EXISTS public.dry_cleaning_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on ticket_id for faster lookups
CREATE INDEX IF NOT EXISTS dry_cleaning_items_ticket_id_idx ON public.dry_cleaning_items (ticket_id);

-- Ticket laundry options table
CREATE TABLE IF NOT EXISTS public.ticket_laundry_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  option_type TEXT CHECK (option_type IN ('separateByColor', 'delicateDry', 'stainRemoval', 'bleach', 'noFragrance', 'noDry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on ticket_id for faster lookups
CREATE INDEX IF NOT EXISTS ticket_laundry_options_ticket_id_idx ON public.ticket_laundry_options (ticket_id);

-- Expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on date for faster lookups
CREATE INDEX IF NOT EXISTS expenses_date_idx ON public.expenses (date);

-- Inventory items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  threshold INTEGER DEFAULT 5,
  unit TEXT DEFAULT 'unidad',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer feedback table
CREATE TABLE IF NOT EXISTS public.customer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  source TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on customer_id for faster lookups
CREATE INDEX IF NOT EXISTS customer_feedback_customer_id_idx ON public.customer_feedback (customer_id);

-- Error logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_type TEXT,
  user_agent TEXT,
  path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ticket sequence table
CREATE TABLE IF NOT EXISTS public.ticket_sequence (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_number INTEGER DEFAULT 0
);

-- Insert initial ticket sequence if not exists
INSERT INTO public.ticket_sequence (id, last_number)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Ticket sequence resets table
CREATE TABLE IF NOT EXISTS public.ticket_sequence_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reset_by TEXT NOT NULL,
  notes TEXT,
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create or replace function to get next ticket number
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

-- Create or replace function to reset ticket sequence
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
END;
$$ LANGUAGE plpgsql;

-- Create or replace function to get metrics
CREATE OR REPLACE FUNCTION public.get_metrics(start_date TEXT, end_date TEXT)
RETURNS TABLE (
  total_valets INTEGER,
  total_sales NUMERIC,
  cash_payments NUMERIC,
  debit_payments NUMERIC,
  mercadopago_payments NUMERIC,
  cuentadni_payments NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT t.id)::INTEGER AS total_valets,
    COALESCE(SUM(t.total), 0) AS total_sales,
    COALESCE(SUM(CASE WHEN t.payment_method = 'cash' THEN t.total ELSE 0 END), 0) AS cash_payments,
    COALESCE(SUM(CASE WHEN t.payment_method = 'debit' THEN t.total ELSE 0 END), 0) AS debit_payments,
    COALESCE(SUM(CASE WHEN t.payment_method = 'mercadopago' THEN t.total ELSE 0 END), 0) AS mercadopago_payments,
    COALESCE(SUM(CASE WHEN t.payment_method = 'cuentadni' THEN t.total ELSE 0 END), 0) AS cuentadni_payments
  FROM
    public.tickets t
  WHERE
    t.created_at >= (start_date || ' 00:00:00')::TIMESTAMP WITH TIME ZONE
    AND t.created_at <= (end_date || ' 23:59:59')::TIMESTAMP WITH TIME ZONE
    AND t.is_canceled = false;
END;
$$ LANGUAGE plpgsql;
