
import { supabase } from '@/integrations/supabase/client';

// Types
interface DiagnosticResult {
  structureOk: boolean;
  ticketsExist: boolean;
  missingTables: string[];
  missingColumns: { table: string; column: string }[];
}

/**
 * Run diagnostics on the database structure and data
 */
export const runDatabaseDiagnostics = async (): Promise<DiagnosticResult> => {
  const result: DiagnosticResult = {
    structureOk: true,
    ticketsExist: false,
    missingTables: [],
    missingColumns: []
  };

  try {
    // Check essential tables
    const requiredTables = ['tickets', 'customers', 'dry_cleaning_items', 'ticket_sequence'];
    
    // Check tickets
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('count(*)')
      .single();

    if (ticketError) {
      console.error('Error checking tickets table:', ticketError);
      result.structureOk = false;
      result.missingTables.push('tickets');
    } else {
      // Check if there are any tickets in the system
      result.ticketsExist = ticketData.count > 0;
    }

    // Check customers
    const { error: customerError } = await supabase
      .from('customers')
      .select('count(*)')
      .limit(1);

    if (customerError) {
      console.error('Error checking customers table:', customerError);
      result.structureOk = false;
      result.missingTables.push('customers');
    }

    // Check dry_cleaning_items
    const { error: itemsError } = await supabase
      .from('dry_cleaning_items')
      .select('count(*)')
      .limit(1);

    if (itemsError) {
      console.error('Error checking dry_cleaning_items table:', itemsError);
      result.structureOk = false;
      result.missingTables.push('dry_cleaning_items');
    }

    // Check ticket_sequence
    const { error: sequenceError } = await supabase
      .from('ticket_sequence')
      .select('count(*)')
      .limit(1);

    if (sequenceError) {
      console.error('Error checking ticket_sequence table:', sequenceError);
      result.structureOk = false;
      result.missingTables.push('ticket_sequence');
    }

    // Check important columns in tickets table
    if (!result.missingTables.includes('tickets')) {
      const requiredTicketColumns = [
        'id', 'ticket_number', 'customer_id', 'total', 'payment_method', 'status', 
        'date', 'is_paid', 'is_canceled', 'created_at'
      ];

      for (const column of requiredTicketColumns) {
        try {
          // Try to select this column - if it doesn't exist, will throw an error
          const { error } = await supabase
            .from('tickets')
            .select(column)
            .limit(1);

          if (error && error.message.includes(`column "${column}" does not exist`)) {
            result.missingColumns.push({ table: 'tickets', column });
            result.structureOk = false;
          }
        } catch (err) {
          console.error(`Error checking column tickets.${column}:`, err);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error running diagnostics:', error);
    return {
      structureOk: false,
      ticketsExist: false,
      missingTables: ['unknown'],
      missingColumns: []
    };
  }
};
