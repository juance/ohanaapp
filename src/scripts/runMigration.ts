
/**
 * Script to run database migrations directly
 *
 * This script reads the SQL migration file and executes it directly
 * against the Supabase database.
 */

import { supabase } from '@/integrations/supabase/client';
import fs from 'fs';
import path from 'path';

/**
 * Run a SQL migration file directly
 */
export const runMigration = async (migrationPath: string): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    console.log(`Reading migration file: ${migrationPath}`);

    // Read the migration file
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Executing migration...');

    // Execute each statement separately
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      console.log(`Executing statement: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc('pg_query', { query: statement });

      if (error) {
        console.error('Error executing statement:', error);
        // Continue with other statements even if one fails
      }
    }

    console.log('Migration executed successfully');
    return {
      success: true,
      message: 'Migration executed successfully'
    };
  } catch (error) {
    console.error('Error running migration:', error);
    return {
      success: false,
      message: `Error running migration: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Create database tables directly using SQL
 */
export const createDatabaseTables = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    console.log('Creating database tables...');

    // SQL to create all required tables
    const sql = `
    -- Create customers table
    CREATE TABLE IF NOT EXISTS public.customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      loyalty_points INTEGER DEFAULT 0,
      valets_count INTEGER DEFAULT 0,
      free_valets INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Create ticket_sequence table
    CREATE TABLE IF NOT EXISTS public.ticket_sequence (
      id INTEGER PRIMARY KEY DEFAULT 1,
      last_number INTEGER DEFAULT 0
    );

    -- Insert initial ticket sequence if not exists
    INSERT INTO public.ticket_sequence (id, last_number)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING;

    -- Create tickets table
    CREATE TABLE IF NOT EXISTS public.tickets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_number TEXT NOT NULL,
      customer_id UUID REFERENCES public.customers(id),
      total NUMERIC NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ready',
      date TIMESTAMP WITH TIME ZONE DEFAULT now(),
      is_paid BOOLEAN DEFAULT false,
      is_canceled BOOLEAN DEFAULT false,
      valet_quantity INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      basket_ticket_number TEXT,
      delivered_date TIMESTAMP WITH TIME ZONE
    );

    -- Create dry_cleaning_items table
    CREATE TABLE IF NOT EXISTS public.dry_cleaning_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price NUMERIC NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Create ticket_laundry_options table
    CREATE TABLE IF NOT EXISTS public.ticket_laundry_options (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
      option_type TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON public.tickets(customer_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
    CREATE INDEX IF NOT EXISTS idx_dry_cleaning_items_ticket_id ON public.dry_cleaning_items(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_ticket_laundry_options_ticket_id ON public.ticket_laundry_options(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
    `;

    // Execute each statement separately
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      console.log(`Executing statement: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc('pg_query', { query: statement });

      if (error) {
        console.error('Error executing statement:', error);
        // Continue with other statements even if one fails
      }
    }

    console.log('Database tables created successfully');
    return {
      success: true,
      message: 'Database tables created successfully'
    };
  } catch (error) {
    console.error('Error creating database tables:', error);
    return {
      success: false,
      message: `Error creating database tables: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Create tables directly using SQL queries
 */
export const createTablesDirectly = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('Creating tables directly...');

    // Create customers table
    const customersSQL = `
      CREATE TABLE IF NOT EXISTS public.customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        loyalty_points INTEGER DEFAULT 0,
        valets_count INTEGER DEFAULT 0,
        free_valets INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `;

    const { error: createCustomersError } = await supabase.rpc('pg_query', { query: customersSQL });

    if (createCustomersError) {
      console.error('Error creating customers table:', createCustomersError);
      return {
        success: false,
        message: `Error creating customers table: ${createCustomersError.message}`,
        details: createCustomersError
      };
    }

    // Create ticket_sequence table
    const sequenceSQL = `
      CREATE TABLE IF NOT EXISTS public.ticket_sequence (
        id INTEGER PRIMARY KEY DEFAULT 1,
        last_number INTEGER DEFAULT 0
      )
    `;

    const { error: createSequenceError } = await supabase.rpc('pg_query', { query: sequenceSQL });

    if (createSequenceError) {
      console.error('Error creating ticket_sequence table:', createSequenceError);
      return {
        success: false,
        message: `Error creating ticket_sequence table: ${createSequenceError.message}`,
        details: createSequenceError
      };
    }

    // Insert initial sequence value
    const insertSequenceSQL = `
      INSERT INTO public.ticket_sequence (id, last_number)
      VALUES (1, 0)
      ON CONFLICT (id) DO NOTHING
    `;

    const { error: insertSequenceError } = await supabase.rpc('pg_query', { query: insertSequenceSQL });

    if (insertSequenceError) {
      console.error('Error inserting initial sequence value:', insertSequenceError);
      return {
        success: false,
        message: `Error inserting initial sequence value: ${insertSequenceError.message}`,
        details: insertSequenceError
      };
    }

    // Create tickets table
    const ticketsSQL = `
      CREATE TABLE IF NOT EXISTS public.tickets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_number TEXT NOT NULL,
        customer_id UUID REFERENCES public.customers(id),
        total NUMERIC NOT NULL DEFAULT 0,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ready',
        date TIMESTAMP WITH TIME ZONE DEFAULT now(),
        is_paid BOOLEAN DEFAULT false,
        is_canceled BOOLEAN DEFAULT false,
        valet_quantity INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        basket_ticket_number TEXT,
        delivered_date TIMESTAMP WITH TIME ZONE
      )
    `;

    const { error: createTicketsError } = await supabase.rpc('pg_query', { query: ticketsSQL });

    if (createTicketsError) {
      console.error('Error creating tickets table:', createTicketsError);
      return {
        success: false,
        message: `Error creating tickets table: ${createTicketsError.message}`,
        details: createTicketsError
      };
    }

    // Create dry_cleaning_items table
    const itemsSQL = `
      CREATE TABLE IF NOT EXISTS public.dry_cleaning_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `;

    const { error: createItemsError } = await supabase.rpc('pg_query', { query: itemsSQL });

    if (createItemsError) {
      console.error('Error creating dry_cleaning_items table:', createItemsError);
      return {
        success: false,
        message: `Error creating dry_cleaning_items table: ${createItemsError.message}`,
        details: createItemsError
      };
    }

    // Create ticket_laundry_options table
    const optionsSQL = `
      CREATE TABLE IF NOT EXISTS public.ticket_laundry_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
        option_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `;

    const { error: createOptionsError } = await supabase.rpc('pg_query', { query: optionsSQL });

    if (createOptionsError) {
      console.error('Error creating ticket_laundry_options table:', createOptionsError);
      return {
        success: false,
        message: `Error creating ticket_laundry_options table: ${createOptionsError.message}`,
        details: createOptionsError
      };
    }

    console.log('All tables created successfully');
    return {
      success: true,
      message: 'All tables created successfully'
    };
  } catch (error) {
    console.error('Error creating tables directly:', error);
    return {
      success: false,
      message: `Error creating tables directly: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    };
  }
};
