
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, TICKETS_STORAGE_KEY } from '../coreUtils';

/**
 * Get stored tickets with optional date filtering
 */
export const getStoredTickets = async (startDate?: Date, endDate?: Date): Promise<any[]> => {
  try {
    let query = supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone),
        dry_cleaning_items (*),
        ticket_laundry_options (*)
      `);
    
    if (startDate) {
      query = query.gte('date', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to match our application structure
    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      basketTicketNumber: ticket.basket_ticket_number,
      customerName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total,
      paymentMethod: ticket.payment_method,
      valetQuantity: ticket.valet_quantity,
      dryCleaningItems: ticket.dry_cleaning_items || [],
      laundryOptions: ticket.ticket_laundry_options?.map((opt: any) => opt.option_type) || [],
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at
    }));
  } catch (error) {
    console.error('Error retrieving tickets from Supabase:', error);
    
    // Fallback to localStorage
    const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);
    
    // Filter by date if provided
    if (startDate || endDate) {
      return localTickets.filter((ticket: any) => {
        const ticketDate = new Date(ticket.createdAt);
        
        if (startDate && ticketDate < startDate) return false;
        if (endDate && ticketDate > endDate) return false;
        
        return true;
      });
    }
    
    return localTickets;
  }
};
