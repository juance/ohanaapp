-- Enable public access to tickets table
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access to tickets
CREATE POLICY "Allow anonymous read access to tickets"
ON tickets FOR SELECT
USING (true);

-- Create policy to allow anonymous insert access to tickets
CREATE POLICY "Allow anonymous insert access to tickets"
ON tickets FOR INSERT
WITH CHECK (true);

-- Create policy to allow anonymous update access to tickets
CREATE POLICY "Allow anonymous update access to tickets"
ON tickets FOR UPDATE
USING (true)
WITH CHECK (true);

-- Enable public access to customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access to customers
CREATE POLICY "Allow anonymous read access to customers"
ON customers FOR SELECT
USING (true);

-- Create policy to allow anonymous insert access to customers
CREATE POLICY "Allow anonymous insert access to customers"
ON customers FOR INSERT
WITH CHECK (true);

-- Create policy to allow anonymous update access to customers
CREATE POLICY "Allow anonymous update access to customers"
ON customers FOR UPDATE
USING (true)
WITH CHECK (true);

-- Enable public access to dry_cleaning_items table
ALTER TABLE dry_cleaning_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access to dry_cleaning_items
CREATE POLICY "Allow anonymous read access to dry_cleaning_items"
ON dry_cleaning_items FOR SELECT
USING (true);

-- Create policy to allow anonymous insert access to dry_cleaning_items
CREATE POLICY "Allow anonymous insert access to dry_cleaning_items"
ON dry_cleaning_items FOR INSERT
WITH CHECK (true);

-- Enable public access to ticket_laundry_options table
ALTER TABLE ticket_laundry_options ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access to ticket_laundry_options
CREATE POLICY "Allow anonymous read access to ticket_laundry_options"
ON ticket_laundry_options FOR SELECT
USING (true);

-- Create policy to allow anonymous insert access to ticket_laundry_options
CREATE POLICY "Allow anonymous insert access to ticket_laundry_options"
ON ticket_laundry_options FOR INSERT
WITH CHECK (true);

-- Enable public access to ticket_sequence table
ALTER TABLE ticket_sequence ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access to ticket_sequence
CREATE POLICY "Allow anonymous read access to ticket_sequence"
ON ticket_sequence FOR SELECT
USING (true);

-- Create policy to allow anonymous update access to ticket_sequence
CREATE POLICY "Allow anonymous update access to ticket_sequence"
ON ticket_sequence FOR UPDATE
USING (true)
WITH CHECK (true);

-- Enable RPC function access
GRANT EXECUTE ON FUNCTION get_next_ticket_number() TO anon;
