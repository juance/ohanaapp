
-- Add delivered_date column to tickets table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tickets'
      AND column_name = 'delivered_date'
  ) THEN
    ALTER TABLE public.tickets
    ADD COLUMN delivered_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;
