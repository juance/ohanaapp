import { supabase } from '@/integrations/supabase/client';

// Get ticket services (dry cleaning items) with immediate default values
export const getTicketServices = async (ticketId: string) => {
  // Return an empty default state immediately
  const defaultServices = [];
  
  try {
    // First, check if this is a valet ticket
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('valet_quantity, total')
      .eq('id', ticketId)
      .single();
      
    if (ticketError) {
      console.error('Error fetching ticket data:', ticketError);
      return defaultServices;
    }
    
    // If it has valet_quantity > 0, add it as a service
    if (ticketData && ticketData.valet_quantity > 0) {
      return [{
        name: 'Valet',
        price: ticketData.total / ticketData.valet_quantity,
        quantity: ticketData.valet_quantity
      }];
    }
    
    // Otherwise look for dry cleaning items
    const { data, error } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
      
    if (error) {
      console.error('Error fetching ticket services:', error);
      return defaultServices;
    }
    
    // Only return populated data if we have items
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
    }
    
    return defaultServices;
  } catch (error) {
    console.error('Error fetching ticket services:', error);
    return defaultServices;
  }
};

// Get laundry options for a ticket
export const getTicketOptions = async (ticketId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('ticket_laundry_options')
      .select('option_type')
      .eq('ticket_id', ticketId);
      
    if (error) throw error;
    
    return data.map(item => item.option_type);
  } catch (error) {
    console.error('Error fetching ticket options:', error);
    return [];
  }
};
