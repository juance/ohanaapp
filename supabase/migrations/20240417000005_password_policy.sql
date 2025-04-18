-- Script para implementar políticas de contraseñas
-- Cambio de contraseña cada 180 días y longitud mínima de 8 caracteres

-- Agregar columna para almacenar la fecha del último cambio de contraseña
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_last_changed TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Función para verificar si una contraseña necesita ser cambiada (más de 180 días)
CREATE OR REPLACE FUNCTION public.password_needs_change(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_changed TIMESTAMP WITH TIME ZONE;
  days_since_change INTEGER;
BEGIN
  -- Obtener la fecha del último cambio de contraseña
  SELECT password_last_changed INTO last_changed
  FROM public.users
  WHERE id = user_id;
  
  -- Si no hay fecha registrada, asumir que necesita cambio
  IF last_changed IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calcular días desde el último cambio
  days_since_change := EXTRACT(DAY FROM (now() - last_changed));
  
  -- Verificar si han pasado más de 180 días
  RETURN days_since_change > 180;
END;
$$;

-- Función para actualizar la fecha de cambio de contraseña
CREATE OR REPLACE FUNCTION public.update_password_change_date()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Si la contraseña ha cambiado, actualizar la fecha
  IF OLD.password IS DISTINCT FROM NEW.password THEN
    NEW.password_last_changed := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para actualizar automáticamente la fecha de cambio de contraseña
DROP TRIGGER IF EXISTS update_password_change_date_trigger ON public.users;
CREATE TRIGGER update_password_change_date_trigger
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_password_change_date();

-- Función para crear un usuario con validación de longitud de contraseña
CREATE OR REPLACE FUNCTION public.create_user_with_validation(
  user_name TEXT,
  user_phone TEXT,
  user_password TEXT,
  user_role TEXT DEFAULT 'client'
)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Validar longitud mínima de contraseña (8 caracteres)
  IF length(user_password) < 8 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
  END IF;
  
  -- Insertar nuevo usuario
  INSERT INTO public.users (
    name, 
    phone_number, 
    password, 
    role, 
    password_last_changed
  )
  VALUES (
    user_name, 
    user_phone, 
    user_password, 
    user_role, 
    now()
  )
  RETURNING id INTO new_user_id;
  
  -- Devolver el usuario creado
  RETURN QUERY
  SELECT * FROM public.users WHERE id = new_user_id;
END;
$$;

-- Función para actualizar un usuario con validación de longitud de contraseña
CREATE OR REPLACE FUNCTION public.update_user_with_validation(
  user_id UUID,
  user_name TEXT,
  user_phone TEXT,
  user_password TEXT DEFAULT NULL,
  user_role TEXT DEFAULT NULL
)
RETURNS SETOF public.users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  update_query TEXT;
  result_record public.users;
BEGIN
  -- Validar longitud mínima de contraseña (8 caracteres) si se proporciona
  IF user_password IS NOT NULL AND length(user_password) < 8 THEN
    RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
  END IF;
  
  -- Construir la consulta de actualización dinámicamente
  update_query := 'UPDATE public.users SET ';
  
  -- Agregar campos a actualizar
  IF user_name IS NOT NULL THEN
    update_query := update_query || 'name = ' || quote_literal(user_name) || ', ';
  END IF;
  
  IF user_phone IS NOT NULL THEN
    update_query := update_query || 'phone_number = ' || quote_literal(user_phone) || ', ';
  END IF;
  
  IF user_password IS NOT NULL THEN
    update_query := update_query || 'password = ' || quote_literal(user_password) || ', ';
  END IF;
  
  IF user_role IS NOT NULL THEN
    update_query := update_query || 'role = ' || quote_literal(user_role) || ', ';
  END IF;
  
  -- Eliminar la coma final y agregar la condición WHERE
  update_query := substring(update_query, 1, length(update_query) - 2);
  update_query := update_query || ' WHERE id = ' || quote_literal(user_id) || ' RETURNING *';
  
  -- Ejecutar la consulta
  EXECUTE update_query INTO result_record;
  
  -- Devolver el usuario actualizado
  RETURN NEXT result_record;
END;
$$;
