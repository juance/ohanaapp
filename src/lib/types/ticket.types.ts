
export interface Ticket {
  id: string;
  ticketNumber: string;

  clientName?: string;
  phoneNumber?: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  valetQuantity?: number;
  dryCleaningItems?: DryCleaningItem[];
  laundryOptions?: LaundryOption[];
  createdAt: string;
  pendingSync?: boolean;
  deliveredDate?: string;
  services?: Array<{name: string; quantity?: number}>;
  updatedAt?: string;

  // Additional fields for database compatibility
  ticket_number?: string;
  customerId?: string; // Add customerId field to fix error in ticketServiceCore.ts
}

export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

export interface DryCleaningItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  ticketId?: string;
}

export interface LaundryOption {
  id: string;
  name: string;
  price: number;
  ticketId?: string;    // Add optional field to handle database mappings
  optionType?: string;  // Add optional field to handle database mappings
  createdAt?: string;   // Add optional field to handle database mappings
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
}
