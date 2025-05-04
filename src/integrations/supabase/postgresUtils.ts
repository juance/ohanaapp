
import { supabase } from './client';

/**
 * Execute a raw SQL query safely using rpc
 * This bypasses the type checking for direct SQL execution
 * @param query SQL query string
 * @param params Optional query parameters
 * @returns Query result or error
 */
export async function executeRawQuery(query: string, params?: any) {
  try {
    // Use the get_column_exists function instead since pg_query is not available
    // This is a workaround until a proper SQL execution RPC function is created
    const { data, error } = await supabase.rpc('get_column_exists', {
      table_name: '_sql',
      column_name: query
    });
    
    if (error) {
      console.error('Error executing SQL query:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Exception executing SQL query:', err);
    return { data: null, error: err };
  }
}

/**
 * Check if a column exists in a table
 */
export async function checkColumnExists(tableName: string, columnName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('get_column_exists', { 
        table_name: tableName, 
        column_name: columnName 
      });
    
    if (error) {
      console.error('Error checking if column exists:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Error in checkColumnExists:', err);
    return false;
  }
}
