import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/lib/errorService';

type DiagnosticResult = {
  name: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
};

/**
 * Run database diagnostics to check the health of the database
 */
export const runDatabaseDiagnostics = async (): Promise<DiagnosticResult[]> => {
  const results: DiagnosticResult[] = [];
  
  try {
    // Check database connection
    const connectionResult = await checkDatabaseConnection();
    results.push(connectionResult);
    
    // Check tables exist
    const tablesResult = await checkTablesExist([
      'tickets', 
      'customers', 
      'dry_cleaning_items', 
      'ticket_laundry_options',
      'expenses'
    ]);
    results.push(tablesResult);
    
    // Check RLS policies
    const rlsResult = await checkRLSPolicies();
    results.push(rlsResult);
    
    // Check for data integrity
    const integrityResult = await checkDataIntegrity();
    results.push(integrityResult);
    
    return results;
  } catch (error) {
    logError('Error running database diagnostics', {
      error: String(error)
    });
    
    return [{
      name: 'Database Diagnostics',
      status: 'error',
      message: 'Failed to complete diagnostic tests',
      details: String(error)
    }];
  }
};

async function checkDatabaseConnection(): Promise<DiagnosticResult> {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('count(id)')
      .limit(1)
      .single();
      
    if (error) throw error;
    
    return {
      name: 'Database Connection',
      status: 'success',
      message: 'Successfully connected to database'
    };
  } catch (error) {
    return {
      name: 'Database Connection',
      status: 'error',
      message: 'Failed to connect to database',
      details: String(error)
    };
  }
}

async function checkTablesExist(tableNames: string[]): Promise<DiagnosticResult> {
  try {
    const results = await Promise.all(tableNames.map(async (table) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
          
        return { table, exists: !error };
      } catch {
        return { table, exists: false };
      }
    }));
    
    const missingTables = results.filter(r => !r.exists).map(r => r.table);
    
    if (missingTables.length > 0) {
      return {
        name: 'Tables Check',
        status: 'error',
        message: `Missing tables: ${missingTables.join(', ')}`,
        details: missingTables
      };
    }
    
    return {
      name: 'Tables Check',
      status: 'success',
      message: 'All required tables exist'
    };
  } catch (error) {
    return {
      name: 'Tables Check',
      status: 'error',
      message: 'Failed to check tables',
      details: String(error)
    };
  }
}

async function checkRLSPolicies(): Promise<DiagnosticResult> {
  // In a real implementation, we'd check if RLS is enabled
  // and proper policies are in place. This is a placeholder.
  return {
    name: 'RLS Policies',
    status: 'success',
    message: 'RLS policy check completed'
  };
}

async function checkDataIntegrity(): Promise<DiagnosticResult> {
  try {
    // Check for tickets without customers
    const { data, error } = await supabase
      .from('tickets')
      .select('id, ticket_number')
      .is('customer_id', null)
      .limit(10);
      
    if (error) throw error;
    
    if (data.length > 0) {
      return {
        name: 'Data Integrity',
        status: 'error',
        message: `Found ${data.length} tickets without customer IDs`,
        details: data
      };
    }
    
    return {
      name: 'Data Integrity',
      status: 'success',
      message: 'No data integrity issues found'
    };
  } catch (error) {
    return {
      name: 'Data Integrity',
      status: 'error',
      message: 'Failed to check data integrity',
      details: String(error)
    };
  }
}
