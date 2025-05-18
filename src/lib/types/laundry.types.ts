
export interface LaundryOption {
  id?: string;
  name: string;
  optionType: string;
  option_type?: string; // For backwards compatibility
  type?: string; // For backwards compatibility
  price?: number;
  ticketId?: string;
  createdAt?: string;
  selected?: boolean;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  optionType: string; // Required property
  description?: string;
  quantity?: number;
}
