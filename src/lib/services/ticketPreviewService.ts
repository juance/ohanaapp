
import { LaundryOption, Ticket } from '@/lib/types';
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';
import { generateUUID } from '@/lib/utils/uuidUtils';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Create a ticket object for preview/printing
 */
export const createTicketForPreview = async (
  customerName: string,
  phoneNumber: string,
  activeTab: string,
  totalPrice: number,
  paymentMethod: string,
  effectiveValetQuantity: number,
  dryCleaningItems: any[],
  date: Date,
  useFreeValet: boolean,
  isPaidInAdvance: boolean
): Promise<Ticket> => {
  // Get a ticket number for the preview
  let ticketNumber = '1';
  try {
    ticketNumber = await getNextTicketNumber();
  } catch (error) {
    console.error('Error getting ticket number for preview:', error);
  }

  // Get a random basket ticket number for preview (will be replaced by the server)
  const basketNumber = Math.floor(Math.random() * 999) + 1;

  // Format services based on ticket type
  const services = activeTab === 'valet'
    ? [{ id: generateUUID(), name: 'Valet', price: totalPrice, quantity: effectiveValetQuantity }]
    : dryCleaningItems.map(item => ({
        id: generateUUID(),
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

  // Create the ticket object
  return {
    id: generateUUID(),
    ticketNumber: ticketNumber,
    basketTicketNumber: basketNumber.toString(),
    clientName: customerName,
    phoneNumber,
    total: useFreeValet ? 0 : totalPrice, // Add required total field
    services,
    paymentMethod: paymentMethod as any,
    totalPrice: useFreeValet ? 0 : totalPrice,
    status: TICKET_STATUS.READY,
    date: date.toISOString(), // Add required date field
    createdAt: date.toISOString(),
    isPaid: isPaidInAdvance,
    deliveredDate: null,
    valetQuantity: effectiveValetQuantity
  };
};
