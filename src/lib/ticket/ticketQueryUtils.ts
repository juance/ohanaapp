import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';

/**
 * Check if a relation exists between tables
 */
export const checkTableRelation = async (
  tableName: string,
  foreignTable: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_relation_exists', {
      table_name: tableName,
      foreign_table: foreignTable
    });

    if (error) {
      console.error('Error checking relation:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Error in checkTableRelation:', error);
    return false;
  }
};

/**
 * Map database ticket record to application ticket model
 */
export const mapDbTicketToModel = (dbTicket: any): Ticket => {
  return {
    id: dbTicket.id,
    ticketNumber: dbTicket.ticket_number,
    clientName: dbTicket.customers?.name || 'Cliente sin nombre',
    phoneNumber: dbTicket.customers?.phone || '',
    totalPrice: dbTicket.total || 0,
    paymentMethod: dbTicket.payment_method || 'cash',
    status: dbTicket.status || 'pending',
    isPaid: dbTicket.is_paid || false,
    valetQuantity: dbTicket.valet_quantity || 0,
    createdAt: dbTicket.created_at || new Date().toISOString(),
    deliveredDate: dbTicket.delivered_date || null
  };
};

/**
 * Get ticket details by ID
 */
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          name,
          phone
        )
      `)
      .eq('id', ticketId)
      .single();

    if (error) {
      console.error('Error fetching ticket:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapDbTicketToModel(data);
  } catch (error) {
    console.error('Error in getTicketById:', error);
    return null;
  }
};

/**
 * Update ticket status
 */
export const updateTicketStatus = async (
  ticketId: string, 
  status: string,
  additionalData: Record<string, any> = {}
): Promise<boolean> => {
  try {
    const updateData = {
      status,
      ...additionalData
    };

    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);

    if (error) {
      console.error('Error updating ticket status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateTicketStatus:', error);
    return false;
  }
};
