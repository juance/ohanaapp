-- Agregar columna last_reset_date a la tabla customers si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'customers' 
        AND column_name = 'last_reset_date'
    ) THEN
        ALTER TABLE public.customers ADD COLUMN last_reset_date TIMESTAMP WITH TIME ZONE;
    END IF;
END
$$;
