
// Importar los tipos necesarios
export * from './customer.types';
export * from './laundry.types';
export * from './error.types';
export * from './expense.types';
export * from './feedback.types';
export * from './inventory.types';
export * from './metrics.types';
export * from './sync.types';
export * from './ticket.types';
export * from './auth.types';

// Definir o re-exportar cualquier tipo adicional necesario
export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  deliveredDate: string | null;
  totalPrice: number;
  paymentMethod?: string;
  valetQuantity?: number;
  isPaid?: boolean;
  services?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerName?: string; // Alias para clientName
  customerPhone?: string; // Alias para phoneNumber
  basketTicketNumber?: string;
}

export type PaymentMethod = 'cash' | 'mercadopago' | 'card' | 'debit' | 'credit' | 'transfer' | 'cuentaDni' | string;

// Define LaundryService type
export interface LaundryService {
  id: string;
  name: string;
  price: number;
  description?: string;
}
