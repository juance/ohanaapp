
import { PaymentMethod, LaundryOption, DryCleaningItem } from '@/lib/types';

export interface SelectedDryCleaningItem {
  id: string;
  quantity: number;
}

export interface LaundryServiceOption {
  id: string;
  label: string;
}

export interface DryCleaningOption {
  id: string;
  name: string;
  price: number;
}

export interface ClientFormData {
  clientName: string;
  phoneNumber: string;
}
