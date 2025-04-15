
export interface Ticket {
  id: string;
  ticketNumber: string;
  basketTicketNumber?: string;
  clientName?: string;
  phoneNumber?: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  valetQuantity?: number;
  dryCleaningItems?: any[];
  laundryOptions?: any[];
  createdAt: string;
  pendingSync?: boolean;
}
