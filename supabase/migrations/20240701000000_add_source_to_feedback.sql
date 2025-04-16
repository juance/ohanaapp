-- Agregar columna source a la tabla customer_feedback si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'customer_feedback' 
        AND column_name = 'source'
    ) THEN
        ALTER TABLE public.customer_feedback ADD COLUMN source TEXT DEFAULT 'admin';
    END IF;
END
$$;
