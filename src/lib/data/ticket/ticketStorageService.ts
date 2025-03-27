
import { supabase } from '@/integrations/supabase/client';
import { Customer, DryCleaningItem, LaundryOption, PaymentMethod, Ticket } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage, TICKETS_STORAGE_KEY } from '../coreUtils';
import { storeCustomer } from '../customerService';
import { getNextTicketNumber } from './ticketNumberService';

/**
 * Store ticket data in the database and local storage
 */
export const storeTicketData = async (
  ticketDetails: Partial<Ticket>,
  customerDetails: Pick<Customer, 'name' | 'phoneNumber'>,
  dryCleaningItems: Omit<DryCleaningItem, 'id' | 'ticketId'>[],
  laundryOptions: LaundryOption[]
): Promise<boolean> => {
  try {
    // Generate ticket number if not provided
    const ticketNumber = ticketDetails.ticketNumber || await getNextTicketNumber();
    
    // Store customer data and get customer ID
    const customerResult = await storeCustomer({
      name: customerDetails.name,
      phoneNumber: customerDetails.phoneNumber,
      loyaltyPoints: 0,
      valetsCount: 0,
      freeValets: 0
    });
    
    if (!customerResult || !customerResult.id) {
      throw new Error('Failed to store customer data');
    }
    
    const customerId = customerResult.id;
    
    // Prepare ticket data for database
    const ticketData = {
      ticket_number: ticketNumber,
      customer_id: customerId, // Now using the string ID
      total: ticketDetails.totalPrice || 0,
      payment_method: ticketDetails.paymentMethod || 'cash' as PaymentMethod,
      valet_quantity: ticketDetails.valetQuantity || 1,
      is_paid: ticketDetails.isPaid || false
    };
    
    // Insert ticket into database
    const { data: ticketResult, error: ticketError } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select('id')
      .single();
    
    if (ticketError) throw ticketError;
    
    const ticketId = ticketResult.id;
    
    // Store dry cleaning items
    if (dryCleaningItems.length > 0) {
      const dryCleaningItemsData = dryCleaningItems.map(item => ({
        ticket_id: ticketId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningItemsData);
      
      if (dryCleaningError) throw dryCleaningError;
    }
    
    // Store laundry options
    if (laundryOptions.length > 0) {
      const laundryOptionsData = laundryOptions.map(option => ({
        ticket_id: ticketId,
        option_type: option
      }));
      
      const { error: laundryOptionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(laundryOptionsData);
      
      if (laundryOptionsError) throw laundryOptionsError;
    }
    
    // Create ticket object for local storage
    const newTicket: Ticket = {
      id: ticketId,
      ticketNumber,
      clientName: customerDetails.name,
      phoneNumber: customerDetails.phoneNumber,
      services: [], // Initialize with empty array
      totalPrice: ticketDetails.totalPrice || 0,
      paymentMethod: ticketDetails.paymentMethod || 'cash',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      isPaid: ticketDetails.isPaid || false,
      valetQuantity: ticketDetails.valetQuantity || 1
    };
    
    // Update local storage
    const existingTickets = getFromLocalStorage<Ticket[]>(TICKETS_STORAGE_KEY) || [];
    saveToLocalStorage(TICKETS_STORAGE_KEY, [...existingTickets, newTicket]);
    
    return true;
  } catch (error) {
    console.error('Error storing ticket data:', error);
    return false;
  }
};
