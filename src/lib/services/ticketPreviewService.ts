
import { LaundryOption, Ticket } from '@/lib/types';
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';
import { generateUUID } from '@/lib/utils/uuidUtils';

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
    services,
    paymentMethod: paymentMethod as any,
    totalPrice: useFreeValet ? 0 : totalPrice, // If it's a free valet, set price to 0
    status: 'ready',
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
    isPaid: isPaidInAdvance // Add the paid status
  };
};
