import { PaymentMethod } from '../types';
import { createUnifiedTicket } from './ticketUnifiedService';

// This file is now a wrapper around the unified ticket service
// It's maintained for backward compatibility

/**
 * Create a new ticket in the database
 * 
 * This is now a wrapper around the unified ticket service for backward compatibility
 */
export const createTicket = async ({
  customerName,
  phoneNumber,
  totalPrice,
  paymentMethod,
  valetQuantity = 0,
  isPaidInAdvance = false,
  usesFreeValet = false,
  customDate,
  services = [],
  options = []
}: {
  customerName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  valetQuantity?: number;
  isPaidInAdvance?: boolean;
  usesFreeValet?: boolean;
  customDate?: Date;
  services?: Array<{ name: string; quantity: number; price: number }>;
  options?: string[];
}): Promise<{ success: boolean; ticketId?: string; ticketNumber?: string }> => {
  // Simply delegate to the unified service
  return createUnifiedTicket({
    customerName,
    phoneNumber,
    totalPrice,
    paymentMethod,
    valetQuantity,
    useFreeValet: usesFreeValet,
    isPaidInAdvance,
    services,
    laundryOptions: options
  });
};
