
export interface LaundryOption {
  id?: string;
  name: string;
  optionType: string;
  option_type?: string; // For backwards compatibility
  price?: number; // Added price as optional
  ticketId?: string;
  createdAt?: string;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  description?: string;
}
