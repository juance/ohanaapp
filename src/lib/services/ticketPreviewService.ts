
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

  // Format services based on ticket type with proper names
  const services = activeTab === 'valet'
    ? [{ 
        id: generateUUID(), 
        name: effectiveValetQuantity > 1 ? 'Valets' : 'Valet', 
        price: totalPrice, 
        quantity: effectiveValetQuantity 
      }]
    : dryCleaningItems.map(item => ({
        id: generateUUID(),
        name: item.name || 'Servicio de tintorería',
        price: item.price || 0,
        quantity: item.quantity || 1
      }));

  console.log('Creating ticket preview with services:', services);

  // Create the ticket object
  return {
    id: generateUUID(),
    ticketNumber: ticketNumber,
    clientName: customerName,
    phoneNumber,
    total: useFreeValet ? 0 : totalPrice,
    services,
    paymentMethod: paymentMethod as any,
    totalPrice: useFreeValet ? 0 : totalPrice,
    status: TICKET_STATUS.READY,
    date: date.toISOString(),
    createdAt: date.toISOString(),
    isPaid: isPaidInAdvance,
    deliveredDate: null,
    valetQuantity: effectiveValetQuantity
  };
};
