-- Función para crear la tabla users si no existe
CREATE OR REPLACE FUNCTION public.create_users_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar si la tabla existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    -- Crear la tabla
    CREATE TABLE public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      phone_number TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'client',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Crear índice para búsquedas por teléfono
    CREATE INDEX IF NOT EXISTS idx_users_phone_number ON public.users(phone_number);
    
    -- Insertar un usuario administrador por defecto
    INSERT INTO public.users (name, phone_number, password, role)
    VALUES (
      'Admin General',
      '1123989718',
      '$2a$10$X7VYJpoRnF8C/sjHnNPO7.dQ9PcvT/y5sR6JhHr4hDZ8SvZ2BgLOK', -- Contraseña: Juance001
      'admin'
    )
    ON CONFLICT (phone_number) DO NOTHING;
  END IF;
END;
$$;

-- Función para crear la función get_user_by_phone si no existe
CREATE OR REPLACE FUNCTION public.create_get_user_by_phone_function_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar si la función existe
  IF NOT EXISTS (
    SELECT FROM pg_proc
    WHERE proname = 'get_user_by_phone'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Crear la función
    EXECUTE $FUNC$
    CREATE OR REPLACE FUNCTION public.get_user_by_phone(phone TEXT)
    RETURNS SETOF public.users
    LANGUAGE sql
    SECURITY DEFINER
    AS $INNER$
      SELECT * FROM public.users WHERE phone_number = phone;
    $INNER$;
    $FUNC$;
  END IF;
END;
$$;

-- Función para crear la función create_user si no existe
CREATE OR REPLACE FUNCTION public.create_create_user_function_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar si la función existe
  IF NOT EXISTS (
    SELECT FROM pg_proc
    WHERE proname = 'create_user'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    -- Crear la función
    EXECUTE $FUNC$
    CREATE OR REPLACE FUNCTION public.create_user(
      user_name TEXT,
      user_phone TEXT,
      user_password TEXT,
      user_role TEXT DEFAULT 'client'
    )
    RETURNS SETOF public.users
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $INNER$
    DECLARE
      new_user_id UUID;
    BEGIN
      -- Insertar nuevo usuario
      INSERT INTO public.users (name, phone_number, password, role)
      VALUES (user_name, user_phone, user_password, user_role)
      RETURNING id INTO new_user_id;
      
      -- Devolver el usuario creado
      RETURN QUERY
      SELECT * FROM public.users WHERE id = new_user_id;
    END;
    $INNER$;
    $FUNC$;
  END IF;
END;
$$;
