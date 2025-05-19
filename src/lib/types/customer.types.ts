
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  phone_number?: string;  // For compatibility with different API formats
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
  // Add these aliases for consistent property access
  phoneNumber?: string; // Alias for phone or phone_number
  valetsCount?: number; // Alias for valets_count
  freeValets?: number; // Alias for free_valets
  loyaltyPoints?: number; // Alias for loyalty_points
  lastVisit?: string; // Alias for last_visit
  createdAt?: string; // Alias for created_at
  valetsRedeemed?: number; // Alias for valets_redeemed
}

export interface CustomerWithStats extends Customer {
  visitFrequency?: string;
  lastVisitDate?: string;
  visitCount?: number;
}
