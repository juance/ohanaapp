
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  phone_number?: string;  // Para compatibilidad con diferentes formatos de API
  email?: string;
  valets_count?: number;
  free_valets?: number;
  loyalty_points?: number;
  last_visit?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  valets_redeemed?: number;
  last_reset_date?: string;
}

export interface CustomerWithStats extends Customer {
  visitFrequency?: string;
  lastVisitDate?: string;
  visitCount?: number;
}
