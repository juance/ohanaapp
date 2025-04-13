
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { updateCustomerLastVisit } from '@/lib/data/customer/customerStorageService';
import { LaundryOption, Customer } from '@/lib/types';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

export const storeTicket = async (
  ticketData: {
    ticketNumber: string;
    totalPrice: number;
    paymentMethod: string;
    valetQuantity: number;
  },
  customerData: {
    name: string;
    phoneNumber: string;
  },
  dryCleaningItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>,
  laundryOptions: LaundryOption[]
) => {
  try {
    // First try to store in Supabase
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketData.ticketNumber,
        client_name: customerData.name,
        phone_number: customerData.phoneNumber,
        total_price: ticketData.totalPrice,
        payment_method: ticketData.paymentMethod,
        valet_quantity: ticketData.valetQuantity,
        status: TICKET_STATUS.READY // Usar el mismo estado que en createTicket
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // Store dry cleaning items if any
    if (dryCleaningItems.length > 0) {
      const dryCleaningToInsert = dryCleaningItems.map(item => ({
        ticket_id: data.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningToInsert);

      if (dryCleaningError) {
        console.error('Error storing dry cleaning items:', dryCleaningError);
      }
    }

    // Store laundry options if any
    if (laundryOptions.length > 0) {
      const optionsToInsert = laundryOptions.map(option => ({
        ticket_id: data.id,
        name: option.name
      }));

      const { error: optionsError } = await supabase
        .from('laundry_options')
        .insert(optionsToInsert);

      if (optionsError) {
        console.error('Error storing laundry options:', optionsError);
      }
    }

    // Try to update the customer's last visit
    try {
      // Find customer by phone number
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customerData.phoneNumber)
        .single();

      if (customer) {
        await updateCustomerLastVisit(customer.id);
      }
    } catch (customerError) {
      console.error('Error updating customer last visit:', customerError);
    }

    return true;
  } catch (error) {
    console.error('Error storing ticket in Supabase:', error);

    // Fallback to local storage
    try {
      const now = new Date().toISOString();
      const ticketId = uuidv4();

      const ticketToStore = {
        id: ticketId,
        ticketNumber: ticketData.ticketNumber,
        clientName: customerData.name,
        phoneNumber: customerData.phoneNumber,
        totalPrice: ticketData.totalPrice,
        paymentMethod: ticketData.paymentMethod,
        valetQuantity: ticketData.valetQuantity,
        createdAt: now,
        status: TICKET_STATUS.READY, // Usar el mismo estado que en createTicket
        pendingSync: true,
        dryCleaningItems,
        laundryOptions
      };

      // Get existing tickets or initialize empty array
      const existingTicketsJson = localStorage.getItem('tickets');
      const existingTickets = existingTicketsJson ? JSON.parse(existingTicketsJson) : [];

      // Add new ticket
      existingTickets.push(ticketToStore);

      // Save back to localStorage
      localStorage.setItem('tickets', JSON.stringify(existingTickets));

      return true;
    } catch (localError) {
      console.error('Error storing ticket locally:', localError);
      return false;
    }
  }
};
