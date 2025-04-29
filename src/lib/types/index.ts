
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
}

export type PaymentMethod = 'cash' | 'mercadopago' | 'card' | 'debit' | 'credit' | 'transfer' | 'cuentaDni' | string;
