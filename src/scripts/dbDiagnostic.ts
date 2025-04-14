/**
 * Database Diagnostic Script
 * 
 * This script checks the database structure and verifies that all required tables
 * and columns exist. It also checks for any inconsistencies in the data.
 */

import { supabase } from '@/integrations/supabase/client';

// Required tables and their columns
const requiredTables = [
  {
    name: 'tickets',
    columns: [
      'id', 'ticket_number', 'customer_id', 'total', 'payment_method',
      'status', 'date', 'is_paid', 'is_canceled', 'valet_quantity',
      'created_at', 'updated_at', 'basket_ticket_number', 'delivered_date'
    ]
  },
  {
    name: 'customers',
    columns: [
      'id', 'name', 'phone', 'loyalty_points', 'valets_count', 'free_valets',
      'created_at', 'updated_at'
    ]
  },
  {
    name: 'dry_cleaning_items',
    columns: [
      'id', 'ticket_id', 'name', 'price', 'quantity', 'created_at'
    ]
  },
  {
    name: 'ticket_laundry_options',
    columns: [
      'id', 'ticket_id', 'option_type', 'created_at'
    ]
  },
  {
    name: 'ticket_sequence',
    columns: [
      'id', 'last_number'
    ]
  }
];

/**
 * Check if a table exists in the database
 */
const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    console.log(`Checking if table ${tableName} exists...`);
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .single();

    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Check if a column exists in a table
 */
const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    console.log(`Checking if column ${columnName} exists in table ${tableName}...`);
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .eq('column_name', columnName)
      .single();

    if (error) {
      console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, error);
    return false;
  }
};

/**
 * Check if the database structure is correct
 */
export const checkDatabaseStructure = async (): Promise<{
  success: boolean;
  missingTables: string[];
  missingColumns: { table: string; column: string }[];
}> => {
  const missingTables: string[] = [];
  const missingColumns: { table: string; column: string }[] = [];

  console.log('Checking database structure...');

  // Check if tables exist
  for (const table of requiredTables) {
    const tableExists = await checkTableExists(table.name);
    if (!tableExists) {
      console.error(`Table ${table.name} does not exist!`);
      missingTables.push(table.name);
      continue;
    }

    // Check if columns exist
    for (const column of table.columns) {
      const columnExists = await checkColumnExists(table.name, column);
      if (!columnExists) {
        console.error(`Column ${column} does not exist in table ${table.name}!`);
        missingColumns.push({ table: table.name, column });
      }
    }
  }

  const success = missingTables.length === 0 && missingColumns.length === 0;
  
  if (success) {
    console.log('Database structure is correct!');
  } else {
    console.error('Database structure has issues!');
    console.error('Missing tables:', missingTables);
    console.error('Missing columns:', missingColumns);
  }

  return {
    success,
    missingTables,
    missingColumns
  };
};

/**
 * Check if there are any tickets in the database
 */
export const checkTicketsExist = async (): Promise<boolean> => {
  try {
    console.log('Checking if tickets exist...');
    const { data, error, count } = await supabase
      .from('tickets')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Error checking if tickets exist:', error);
      return false;
    }

    console.log(`Found ${count} tickets in the database.`);
    return count > 0;
  } catch (error) {
    console.error('Error checking if tickets exist:', error);
    return false;
  }
};

/**
 * Run all database diagnostics
 */
export const runDatabaseDiagnostics = async (): Promise<{
  structureOk: boolean;
  ticketsExist: boolean;
  missingTables: string[];
  missingColumns: { table: string; column: string }[];
}> => {
  console.log('Running database diagnostics...');
  
  const structureCheck = await checkDatabaseStructure();
  const ticketsExist = await checkTicketsExist();

  return {
    structureOk: structureCheck.success,
    ticketsExist,
    missingTables: structureCheck.missingTables,
    missingColumns: structureCheck.missingColumns
  };
};
