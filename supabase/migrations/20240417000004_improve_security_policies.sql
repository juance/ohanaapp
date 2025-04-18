-- Script para mejorar las políticas de seguridad en Supabase

-- Habilitar RLS en todas las tablas principales
ALTER TABLE IF EXISTS public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.dry_cleaning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ticket_laundry_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customer_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
DROP POLICY IF EXISTS "Admin/Operators can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;

-- Política para que los administradores puedan ver y modificar todos los usuarios
CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- Política para que los operadores puedan ver todos los usuarios pero no modificarlos
CREATE POLICY "Operators can view all users"
ON public.users
FOR SELECT
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'operator'
);

-- Política para que los usuarios puedan ver y modificar su propio registro
CREATE POLICY "Users can manage their own record"
ON public.users
FOR ALL
USING (
  id = auth.uid()
);

-- Políticas para la tabla tickets
DROP POLICY IF EXISTS "Admins can manage all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Operators can manage all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Clients can view their own tickets" ON public.tickets;

-- Política para que los administradores puedan ver y modificar todos los tickets
CREATE POLICY "Admins can manage all tickets"
ON public.tickets
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- Política para que los operadores puedan ver y modificar todos los tickets
CREATE POLICY "Operators can manage all tickets"
ON public.tickets
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'operator'
);

-- Política para que los clientes puedan ver solo sus propios tickets
CREATE POLICY "Clients can view their own tickets"
ON public.tickets
FOR SELECT
USING (
  customer_id = (SELECT id FROM public.customers WHERE phone = (SELECT phone_number FROM public.users WHERE id = auth.uid()))
);

-- Políticas para la tabla customers
DROP POLICY IF EXISTS "Admins can manage all customers" ON public.customers;
DROP POLICY IF EXISTS "Operators can manage all customers" ON public.customers;
DROP POLICY IF EXISTS "Clients can view their own customer record" ON public.customers;

-- Política para que los administradores puedan ver y modificar todos los clientes
CREATE POLICY "Admins can manage all customers"
ON public.customers
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- Política para que los operadores puedan ver y modificar todos los clientes
CREATE POLICY "Operators can manage all customers"
ON public.customers
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'operator'
);

-- Política para que los clientes puedan ver solo su propio registro
CREATE POLICY "Clients can view their own customer record"
ON public.customers
FOR SELECT
USING (
  phone = (SELECT phone_number FROM public.users WHERE id = auth.uid())
);

-- Políticas para la tabla expenses
DROP POLICY IF EXISTS "Admins can manage all expenses" ON public.expenses;
DROP POLICY IF EXISTS "Operators can view all expenses" ON public.expenses;

-- Política para que los administradores puedan ver y modificar todos los gastos
CREATE POLICY "Admins can manage all expenses"
ON public.expenses
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- Política para que los operadores puedan ver todos los gastos pero no modificarlos
CREATE POLICY "Operators can view all expenses"
ON public.expenses
FOR SELECT
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'operator'
);

-- Políticas para la tabla customer_feedback
DROP POLICY IF EXISTS "Admins can manage all feedback" ON public.customer_feedback;
DROP POLICY IF EXISTS "Operators can view all feedback" ON public.customer_feedback;
DROP POLICY IF EXISTS "Clients can manage their own feedback" ON public.customer_feedback;

-- Política para que los administradores puedan ver y modificar todos los comentarios
CREATE POLICY "Admins can manage all feedback"
ON public.customer_feedback
FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- Política para que los operadores puedan ver todos los comentarios pero no modificarlos
CREATE POLICY "Operators can view all feedback"
ON public.customer_feedback
FOR SELECT
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'operator'
);

-- Política para que los clientes puedan ver y modificar solo sus propios comentarios
CREATE POLICY "Clients can manage their own feedback"
ON public.customer_feedback
FOR ALL
USING (
  customer_id = (SELECT id FROM public.customers WHERE phone = (SELECT phone_number FROM public.users WHERE id = auth.uid()))
);

-- Crear una función para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role = required_role
    FROM public.users
    WHERE id = auth.uid()
  );
END;
$$;
