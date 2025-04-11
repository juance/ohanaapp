
-- Create users table for authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- In production, this should be hashed
  email TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policy to the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for admin/operators to see all users
CREATE POLICY "Admin/Operators can view all users"
ON public.users
FOR SELECT
USING (auth.uid() IN (
  SELECT id FROM public.users WHERE role IN ('admin', 'operator')
));

-- Users can see their own record
CREATE POLICY "Users can view their own record"
ON public.users
FOR SELECT
USING (auth.uid()::text = id::text);

-- Create some default users for testing
INSERT INTO public.users (name, phone_number, password, role)
VALUES 
  ('Admin User', '1234567890', 'password', 'admin'),
  ('Operator User', '0987654321', 'password', 'operator'),
  ('Client User', '5555555555', 'password', 'client')
ON CONFLICT (phone_number) DO NOTHING;
