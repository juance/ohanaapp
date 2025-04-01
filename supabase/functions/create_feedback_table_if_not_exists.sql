
-- Function to create the customer_feedback table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_feedback_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'customer_feedback'
  ) THEN
    -- Create the table
    CREATE TABLE public.customer_feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID NOT NULL REFERENCES public.customers(id),
      customer_name TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Add comment
    COMMENT ON TABLE public.customer_feedback IS 'Stores customer feedback and ratings';
  END IF;
END;
$$;
