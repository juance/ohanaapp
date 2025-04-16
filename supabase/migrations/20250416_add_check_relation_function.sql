-- Crear una función para verificar si existe una relación entre dos tablas
CREATE OR REPLACE FUNCTION public.check_relation_exists(table_name text, foreign_table text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  relation_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = table_name
      AND ccu.table_name = foreign_table
  ) INTO relation_exists;
  
  RETURN relation_exists;
END;
$$;

-- Dar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION public.check_relation_exists(text, text) TO anon, authenticated, service_role;
