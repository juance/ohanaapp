
export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
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
  customer?: {
    name: string;
    phone?: string;
  };
}

export interface LaundryOption {
  id?: string;
  name: string; 
  optionType: string;
  value?: boolean;
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
