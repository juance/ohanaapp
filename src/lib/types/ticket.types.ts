
export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Interfaz TicketService completa
export interface TicketService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  basketTicketNumber?: string; // Propiedad añadida para compatibilidad
  clientName: string;
  phoneNumber: string;
  total: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: string;
  isPaid: boolean;
  createdAt: string;
  date: string;
  deliveredDate?: string;
  valetQuantity: number;
  customerId?: string;
  dryCleaningItems?: DryCleaningItem[];
  laundryOptions?: LaundryOption[];
  services?: TicketService[]; // Propiedad añadida para compatibilidad
  customer?: {
    name: string;
    phone?: string;
  };
  usesFreeValet?: boolean;
}

export interface LaundryOption {
  id?: string;
  name: string; 
  optionType: string;
  value?: boolean;
  selected?: boolean; // Propiedad añadida para compatibilidad con useValetForm
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface TicketFormState {
  customerName: string;
  phoneNumber: string;
  valetQuantity: number;
  useFreeValet: boolean;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  activeTab: string;
  date: Date;
  selectedDryCleaningItems: any[];
  getSelectedLaundryOptions: () => LaundryOption[];
  resetCustomerForm: () => void;
  resetValetForm: () => void;
  resetDryCleaningForm: () => void;
  resetTicketFormState: () => void;
  isPaidInAdvance?: boolean;
}
