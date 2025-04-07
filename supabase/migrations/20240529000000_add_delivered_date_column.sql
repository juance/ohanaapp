
-- First check if the column already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tickets'
    AND column_name = 'delivered_date'
  ) THEN
    -- Add the delivered_date column if it doesn't exist
    ALTER TABLE tickets ADD COLUMN delivered_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;
  END IF;
END
$$;
