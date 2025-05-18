
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
