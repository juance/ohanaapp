
import { PaymentMethod } from '@/lib/types';
import { LaundryService } from './LaundryServices';
import { DryCleaningOption, LaundryServiceOption } from './types';

// Mock laundry services
export const laundryServices: LaundryService[] = [
  { id: '1', name: 'Washing', price: 15 },
  { id: '2', name: 'Drying', price: 10 },
  { id: '3', name: 'Ironing', price: 20 },
  { id: '4', name: 'Folding', price: 5 },
  { id: '5', name: 'Stain Removal', price: 25 },
  { id: '6', name: 'Blanket Cleaning', price: 35 },
];

// Dry cleaning items
export const dryCleaningOptions: DryCleaningOption[] = [
  { id: 'shirt', name: 'Shirt', price: 20 },
  { id: 'pants', name: 'Pants', price: 25 },
  { id: 'suit', name: 'Suit', price: 45 },
  { id: 'dress', name: 'Dress', price: 35 },
  { id: 'coat', name: 'Coat', price: 50 },
  { id: 'blanket', name: 'Blanket', price: 40 },
];

// Laundry options
export const laundryOptionsList: LaundryServiceOption[] = [
  { id: 'color_separation', label: 'Color Separation' },
  { id: 'delicate_wash', label: 'Delicate Wash' },
  { id: 'extra_rinse', label: 'Extra Rinse' },
  { id: 'heavy_soil', label: 'Heavy Soil Treatment' },
  { id: 'stain_treatment', label: 'Stain Treatment' },
];

// Payment method options
export const paymentMethods = [
  { id: 'cash' as PaymentMethod, label: 'Cash' },
  { id: 'debit' as PaymentMethod, label: 'Debit Card' },
  { id: 'mercadopago' as PaymentMethod, label: 'Mercado Pago' },
  { id: 'cuenta_dni' as PaymentMethod, label: 'Cuenta DNI' },
];
