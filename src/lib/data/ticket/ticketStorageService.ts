
import { supabase } from '@/integrations/supabase/client';
import { DryCleaningItem, LaundryOption, PaymentMethod } from '@/lib/types';
import { 
  saveToLocalStorage, 
  getFromLocalStorage, 
  TICKETS_STORAGE_KEY,
  formatPaymentMethod 
} from '../coreUtils';
import { 
  getCustomerByPhone, 
  storeCustomer, 
  updateValetsCount, 
  useFreeValet,
  addLoyaltyPoints
} from '../customerService';
import { getNextTicketNumber } from './ticketNumberService';

/**
 * Store ticket data in Supabase or localStorage as fallback
 */
export const storeTicketData = async (
  ticket: {
    ticketNumber?: string;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    valetQuantity: number;
    customDate?: Date;
    usesFreeValet?: boolean;
    isPaidInAdvance?: boolean;
  },
  customer: { name: string; phoneNumber: string },
  dryCleaningItems: Omit<DryCleaningItem, 'id' | 'ticketId'>[],
  laundryOptions: LaundryOption[]
): Promise<boolean> => {
  try {
    // First, ensure customer exists
    let customerId: string;
    let existingCustomer = await getCustomerByPhone(customer.phoneNumber);
    
    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create new customer with default values
      const newCustomer = await storeCustomer({
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        loyaltyPoints: 0,
        valetsCount: 0,
        freeValets: 0
      });
      if (!newCustomer) throw new Error('Failed to create customer');
      customerId = newCustomer.id;
      existingCustomer = newCustomer;
    }
    
    // If using a free valet, verify and update
    if (ticket.usesFreeValet) {
      const success = await useFreeValet(customerId);
      if (!success) {
        throw new Error('Client has no free valets available');
      }
    } 
    // If not a free valet and there are valets, update the count and add loyalty points
    else if (ticket.valetQuantity > 0) {
      await updateValetsCount(customerId, ticket.valetQuantity);
      
      // Add loyalty points for valets (10 points per valet)
      const pointsToAdd = ticket.valetQuantity * 10;
      
      if (pointsToAdd > 0) {
        await addLoyaltyPoints(customerId, pointsToAdd);
        console.log(`Added ${pointsToAdd} loyalty points for ${ticket.valetQuantity} valets`);
      }
    }
    
    // Prepare date field - use custom date if provided, otherwise use current date
    const ticketDate = ticket.customDate ? ticket.customDate.toISOString() : new Date().toISOString();
    
    // Get next ticket number
    const ticketNumber = ticket.ticketNumber || await getNextTicketNumber();
    
    // Get the next basket ticket number
    const { data: basketCountData, error: basketCountError } = await supabase
      .from('tickets')
      .select('basket_ticket_number')
      .order('created_at', { ascending: false })
      .limit(1);
    
    let basketTicketNumber = "1";
    if (!basketCountError && basketCountData && basketCountData.length > 0) {
      const lastBasketNumber = parseInt(basketCountData[0].basket_ticket_number || "0");
      basketTicketNumber = (lastBasketNumber + 1).toString();
    }
    
    // Insert ticket with 'ready' status by default
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        total: ticket.totalPrice,
        payment_method: formatPaymentMethod(ticket.paymentMethod),
        valet_quantity: ticket.valetQuantity,
        customer_id: customerId,
        status: 'ready', // Set status to ready by default
        date: ticketDate,
        created_at: ticketDate,
        is_paid: ticket.isPaidInAdvance || false, // Set paid status based on the isPaidInAdvance flag
        basket_ticket_number: basketTicketNumber // Set the incremental basket ticket number
      })
      .select('*')
      .single();
    
    if (ticketError) throw ticketError;
    
    // Insert dry cleaning items if any
    if (dryCleaningItems.length > 0) {
      const itemsToInsert = dryCleaningItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        ticket_id: ticketData.id
      }));
      
      const { error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .insert(itemsToInsert);
      
      if (itemsError) throw itemsError;
    }
    
    // Insert laundry options if any
    if (laundryOptions.length > 0) {
      const optionsToInsert = laundryOptions.map(option => ({
        ticket_id: ticketData.id,
        option_type: option.id || option.name || String(option)
      }));
      
      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(optionsToInsert);
      
      if (optionsError) throw optionsError;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing data in Supabase:', error);
    
    // Fallback to localStorage
    try {
      const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);
      
      // Get next basket ticket number for local storage
      let nextBasketNumber = 1;
      if (localTickets.length > 0) {
        const lastBasketNumber = Math.max(...localTickets.map(t => parseInt(t.basketTicketNumber || "0")));
        nextBasketNumber = lastBasketNumber + 1;
      }
      
      const newTicket = {
        id: crypto.randomUUID(),
        customerName: customer.name,
        phoneNumber: customer.phoneNumber,
        totalPrice: ticket.totalPrice,
        paymentMethod: ticket.paymentMethod,
        valetQuantity: ticket.valetQuantity,
        dryCleaningItems: dryCleaningItems,
        laundryOptions: laundryOptions,
        createdAt: ticket.customDate ? ticket.customDate.toISOString() : new Date().toISOString(),
        pendingSync: true,
        ticketNumber: Math.floor(Math.random() * 1000) + 1, // Local ticket number as fallback
        basketTicketNumber: nextBasketNumber.toString(), // Incremental basket number
        isPaid: ticket.isPaidInAdvance || false // Set paid status
      };
      
      localTickets.push(newTicket);
      saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
      return true;
    } catch (localError) {
      console.error('Error saving to localStorage:', localError);
      return false;
    }
  }
};
