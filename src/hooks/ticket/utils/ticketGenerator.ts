
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';
import { dryCleaningItems } from '@/components/DryCleaningOptions';
import { LaundryOption, Ticket } from '@/lib/types';
import { TicketFormState } from '../types/ticketFormTypes';

export const prepareTicketData = (formState: TicketFormState) => {
  const {
    paymentMethod,
    totalPrice,
    useFreeValet,
    valetQuantity,
    date,
    isPaidInAdvance
  } = formState;
  
  // Adjust the valets quantity if using a free one
  const effectiveValetQuantity = useFreeValet ? 1 : valetQuantity;
  
  return {
    totalPrice: useFreeValet ? 0 : totalPrice, // If it's free, set price to 0
    paymentMethod: paymentMethod as any,
    valetQuantity: effectiveValetQuantity,
    customDate: date,
    usesFreeValet: useFreeValet,
    isPaidInAdvance
  };
};

export const prepareCustomerData = (formState: TicketFormState) => {
  return {
    name: formState.customerName,
    phoneNumber: formState.phoneNumber,
  };
};

export const prepareDryCleaningItems = (formState: TicketFormState) => {
  const { activeTab, selectedDryCleaningItems } = formState;
  
  return activeTab === 'tintoreria' 
    ? selectedDryCleaningItems.map(item => {
        const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
        return {
          name: itemDetails?.name || '',
          quantity: item.quantity,
          price: (itemDetails?.price || 0) * item.quantity
        };
      })
    : [];
};

export const createTicketForPreview = async (
  formState: TicketFormState
): Promise<Ticket> => {
  const {
    customerName,
    phoneNumber,
    activeTab,
    totalPrice,
    paymentMethod,
    valetQuantity,
    useFreeValet,
    date,
    selectedDryCleaningItems,
    isPaidInAdvance
  } = formState;
  
  // Get a ticket number for the preview
  let ticketNumber = '1';
  try {
    ticketNumber = await getNextTicketNumber();
  } catch (error) {
    console.error('Error getting ticket number for preview:', error);
  }
  
  const effectiveValetQuantity = useFreeValet ? 1 : valetQuantity;
  
  const services = activeTab === 'valet' 
    ? [{ id: crypto.randomUUID(), name: 'Valet', price: totalPrice, quantity: effectiveValetQuantity }] 
    : selectedDryCleaningItems.map(item => {
        const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
        return {
          id: crypto.randomUUID(),
          name: itemDetails?.name || '',
          price: (itemDetails?.price || 0) * item.quantity,
          quantity: item.quantity
        };
      });
      
  return {
    id: crypto.randomUUID(),
    ticketNumber: ticketNumber,
    basketTicketNumber: undefined,
    clientName: customerName,
    phoneNumber,
    services,
    paymentMethod: paymentMethod as any,
    totalPrice: useFreeValet ? 0 : totalPrice,
    status: 'ready',
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
    isPaid: isPaidInAdvance
  };
};
