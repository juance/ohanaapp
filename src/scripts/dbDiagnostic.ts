
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/lib/errorHandlingService';
import { ErrorLevel, ErrorContext } from '@/lib/types';

export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_exists', {
      table_name: tableName,
      column_name: 'id'
    });
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

export const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_exists', {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in table ${tableName}:`, error);
    return false;
  }
};

export const checkRelationExists = async (table: string, foreignTable: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_relation_exists', {
      table_name: table,
      foreign_table: foreignTable
    });
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error(`Error checking relation between ${table} and ${foreignTable}:`, error);
    return false;
  }
};

export const checkFunctionExists = async (functionName: string): Promise<boolean> => {
  try {
    // This is a simple check, we try to call the function and see if it errors
    const { error } = await supabase.rpc(functionName);
    
    // If the error message includes "function does not exist", then the function doesn't exist
    return !error || !error.message.includes('function does not exist');
  } catch (error) {
    console.error(`Error checking if function ${functionName} exists:`, error);
    return false;
  }
};

export const runTableCheck = async (): Promise<{
  customersTable: boolean;
  ticketsTable: boolean;
  relationExists: boolean;
}> => {
  const customersTable = await checkTableExists('customers');
  const ticketsTable = await checkTableExists('tickets');
  const relationExists = await checkRelationExists('tickets', 'customers');
  
  return {
    customersTable,
    ticketsTable,
    relationExists
  };
};

export const runColumnCheck = async (): Promise<{
  ticketNumberColumn: boolean;
  customerIdColumn: boolean;
  deliveredDateColumn: boolean;
}> => {
  const ticketNumberColumn = await checkColumnExists('tickets', 'ticket_number');
  const customerIdColumn = await checkColumnExists('tickets', 'customer_id');
  const deliveredDateColumn = await checkColumnExists('tickets', 'delivered_date');
  
  return {
    ticketNumberColumn,
    customerIdColumn,
    deliveredDateColumn
  };
};

export const runFunctionCheck = async (): Promise<{
  getNextTicketNumber: boolean;
  recalculateCustomerVisits: boolean;
}> => {
  const getNextTicketNumber = await checkFunctionExists('get_next_ticket_number');
  const recalculateCustomerVisits = await checkFunctionExists('recalculate_customer_visits');
  
  return {
    getNextTicketNumber,
    recalculateCustomerVisits
  };
};

export const runDatabaseDiagnostics = async (): Promise<{
  tables: ReturnType<typeof runTableCheck>;
  columns: ReturnType<typeof runColumnCheck>;
  functions: ReturnType<typeof runFunctionCheck>;
  status: 'success' | 'warning' | 'error';
  message: string;
}> => {
  try {
    const tables = await runTableCheck();
    const columns = await runColumnCheck();
    const functions = await runFunctionCheck();
    
    // Determine status based on diagnostic results
    let status: 'success' | 'warning' | 'error' = 'success';
    let message = 'Database structure is valid';
    
    if (!tables.customersTable || !tables.ticketsTable) {
      status = 'error';
      message = 'Missing required tables';
    } else if (!tables.relationExists) {
      status = 'warning';
      message = 'Missing relation between tickets and customers';
    } else if (!columns.ticketNumberColumn || !columns.customerIdColumn) {
      status = 'error';
      message = 'Missing required columns';
    } else if (!functions.getNextTicketNumber) {
      status = 'warning';
      message = 'Missing ticket number generation function';
    }
    
    return {
      tables,
      columns,
      functions,
      status,
      message
    };
  } catch (error) {
    logError(
      'Failed to run database diagnostics',
      ErrorLevel.ERROR,
      ErrorContext.DATABASE,
      error
    );
    
    return {
      tables: {
        customersTable: false,
        ticketsTable: false,
        relationExists: false
      },
      columns: {
        ticketNumberColumn: false,
        customerIdColumn: false,
        deliveredDateColumn: false
      },
      functions: {
        getNextTicketNumber: false,
        recalculateCustomerVisits: false
      },
      status: 'error',
      message: 'Failed to run diagnostics'
    };
  }
};
