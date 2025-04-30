// scripts/dbDiagnostic.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key must be defined in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase.from('test_table').select('*').limit(1);

    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }

    console.log('Successfully connected to Supabase');
    return true;
  } catch (error: any) {
    console.error('Error connecting to Supabase:', error.message);
    return false;
  }
}

async function listTables() {
  try {
    const response = await supabase.from('pg_tables').select('*').eq('schemaname', 'public');

    if (response.error) {
      console.error('Error listing tables:', response.error.message);
      return;
    }

    console.log('Tables in the public schema:');
    response.data.forEach((table: any) => {
      console.log(`- ${table.tablename}`);
    });
  } catch (error: any) {
    console.error('Error listing tables:', error.message);
  }
}

async function checkTableExists(table: string) {
  try {
    const response = await supabase
      .from('pg_tables')
      .select('*')
      .eq('schemaname', 'public')
      .eq('tablename', table);

    if (response.error) {
      console.error(`Error checking if table ${table} exists:`, response.error.message);
      return false;
    }

    return response.data.length > 0;
  } catch (error: any) {
    console.error(`Error checking if table ${table} exists:`, error.message);
    return false;
  }
}

async function checkColumnsExist(table: string) {
  try {
    const response = await supabase
      .from('pg_attribute')
      .select('attname')
      .eq('attrelid', `"${table}"`)
      .gt('attnum', 0)
      .not('attisdropped', true);

    if (response.error) {
      console.error(`Error checking columns for table ${table}:`, response.error.message);
      return;
    }

    console.log(`Columns in table ${table}:`);
    response.data.forEach((column: any) => {
      console.log(`- ${column.attname}`);
    });
  } catch (error: any) {
    console.error(`Error checking columns for table ${table}:`, error.message);
  }
}

async function analyzeTable(table: string) {
  try {
    const validTables = [
      'expenses', 'tickets', 'customers', 'users', 'customer_feedback',
      'customer_types', 'dashboard_stats', 'dry_cleaning_items', 'error_logs',
      'inventory_items', 'system_version', 'test_table', 'ticket_laundry_options',
      'ticket_sequence', 'ticket_sequence_resets'
    ];

    if (validTables.includes(table)) {
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        console.error(`Error analyzing table ${table}:`, error.message);
      } else {
        console.log(`Analysis of table ${table}:`);
        console.log(data);
      }
    } else {
      console.warn(`Skipping analysis of table ${table} because it's not in the valid tables list.`);
    }
  } catch (error: any) {
    console.error(`Error analyzing table ${table}:`, error.message);
  }
}

async function main() {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    console.error('Failed to connect to the database. Exiting.');
    process.exit(1);
  }

  await listTables();

  const tablesToCheck = ['expenses', 'tickets', 'customers'];
  for (const table of tablesToCheck) {
    const exists = await checkTableExists(table);
    console.log(`Table ${table} exists: ${exists}`);
    if (exists) {
      await checkColumnsExist(table);
      await analyzeTable(table);
    }
  }
}

main();
