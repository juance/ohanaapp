
export interface LaundryOption {
  id?: string;
  name: string;
  optionType: string;
  price?: number; // Added price as optional
  ticketId?: string;
  createdAt?: string;
  option_type?: string; // For backwards compatibility
}
