
// Ticket types

export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  valetQuantity: number;
  createdAt: string;
  deliveredDate: string | null;
  customerId?: string;
  basketTicketNumber?: string;
  dryCleaningItems?: any[];
  laundryOptions?: LaundryOption[];
  ticketData?: any; // Add this property to fix the build errors
  services?: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  optionType: string;
}

export interface LaundryOption {
  id?: string;
  name: string;
  optionType: string;
  price?: number;
  ticketId?: string;
  createdAt?: string;
}
