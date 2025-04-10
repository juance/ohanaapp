
// If this file already exists, we need to add/update the CustomerFeedback type
export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  pendingSync?: boolean;
}

// Define any additional types needed (this will be merged with existing types)
export interface LaundryOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  selected?: boolean;
}

export interface Ticket {
  id: string;
  ticketNumber?: string;
  clientName: string;
  phoneNumber: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  pendingSync?: boolean;
  // Include other properties that might be used in the application
}

// Define PaymentMethod type if it's used in the app
export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';
