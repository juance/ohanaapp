
export interface LaundryOption {
  id?: string;
  name: string;
  optionType: string;
  option_type?: string; // Para compatibilidad hacia atrás
  price?: number; // Añadido price como opcional
  ticketId?: string;
  createdAt?: string;
}
