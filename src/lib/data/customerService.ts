
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';
import { toast } from '@/lib/toast';

/**
 * Get a customer by phone number
 */
export const getCustomerByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name || '',
      phoneNumber: data.phone,
      loyaltyPoints: data.loyalty_points || 0,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      valetsRedeemed: data.valets_redeemed || 0,
      lastVisit: data.last_visit
    };
  } catch (error) {
    console.error('Error getting customer by phone:', error);
    return null;
  }
};

/**
 * Store a new customer
 */
export const storeCustomer = async (customer: {
  name: string;
  phoneNumber: string;
  loyaltyPoints?: number;
  valetsCount?: number;
  freeValets?: number;
}): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        phone: customer.phoneNumber,
        loyalty_points: customer.loyaltyPoints || 0,
        valets_count: customer.valetsCount || 0,
        free_valets: customer.freeValets || 0,
        last_visit: new Date().toISOString()
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name || '',
      phoneNumber: data.phone,
      loyaltyPoints: data.loyalty_points || 0,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      valetsRedeemed: data.valets_redeemed || 0,
      lastVisit: data.last_visit
    };
  } catch (error) {
    console.error('Error storing customer:', error);
    return null;
  }
};

/**
 * Update valets count for a customer
 */
export const updateValetsCount = async (customerId: string, valetsToAdd: number): Promise<boolean> => {
  try {
    // First, get the current customer data
    const { data: customerData, error: getError } = await supabase
      .from('customers')
      .select('valets_count, loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    // Calculate new values
    const currentValetsCount = customerData?.valets_count || 0;
    const newValetsCount = currentValetsCount + valetsToAdd;
    
    // Calculate if a free valet should be added
    // A free valet is earned every 10 valets
    const currentFreeValetsEarned = Math.floor(currentValetsCount / 10);
    const newFreeValetsEarned = Math.floor(newValetsCount / 10);
    const freeValetsToAdd = newFreeValetsEarned - currentFreeValetsEarned;
    
    // Update the customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        valets_count: newValetsCount,
        free_valets: supabase.rpc('increment', { 
          row_id: customerId,
          table_name: 'customers',
          column_name: 'free_valets',
          increment_amount: freeValetsToAdd 
        }),
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    // Notify the user if they earned a free valet
    if (freeValetsToAdd > 0) {
      toast.success(`¡Felicidades! Has ganado ${freeValetsToAdd} valet${freeValetsToAdd > 1 ? 's' : ''} gratis`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating valets count:', error);
    return false;
  }
};

/**
 * Update loyalty points for a customer
 */
export const updateLoyaltyPoints = async (customerId: string, pointsToAdd: number): Promise<boolean> => {
  try {
    // First, get the current customer data
    const { data: customerData, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points, free_valets')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    // Calculate new values
    const currentPoints = customerData?.loyalty_points || 0;
    const newPoints = currentPoints + pointsToAdd;
    
    // Calculate if a free valet should be added from loyalty points
    // A free valet is earned every 100 loyalty points
    const currentFreeValetsEarned = Math.floor(currentPoints / 100);
    const newFreeValetsEarned = Math.floor(newPoints / 100);
    const freeValetsToAdd = newFreeValetsEarned - currentFreeValetsEarned;
    
    // Update the customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        loyalty_points: newPoints,
        free_valets: supabase.rpc('increment', { 
          row_id: customerId,
          table_name: 'customers',
          column_name: 'free_valets',
          increment_amount: freeValetsToAdd 
        }),
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    // Notify the user if they earned a free valet
    if (freeValetsToAdd > 0) {
      toast.success(`¡Felicidades! Has ganado ${freeValetsToAdd} valet${freeValetsToAdd > 1 ? 's' : ''} gratis por puntos de fidelidad`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating loyalty points:', error);
    return false;
  }
};

/**
 * Use a free valet for a customer
 */
export const useFreeValet = async (customerId: string): Promise<boolean> => {
  try {
    // First, get the current customer data
    const { data: customerData, error: getError } = await supabase
      .from('customers')
      .select('free_valets, valets_redeemed')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    // Check if the customer has free valets available
    const freeValets = customerData?.free_valets || 0;
    
    if (freeValets <= 0) {
      toast.error('El cliente no tiene valets gratuitos disponibles');
      return false;
    }
    
    // Calculate new values
    const valetsRedeemed = customerData?.valets_redeemed || 0;
    
    // Update the customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        free_valets: freeValets - 1,
        valets_redeemed: valetsRedeemed + 1,
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error using free valet:', error);
    return false;
  }
};

/**
 * Get frequent clients (for dashboard)
 */
export const getFrequentClients = async (limit = 5): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('valets_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map(client => ({
      id: client.id,
      clientName: client.name,
      phoneNumber: client.phone,
      valetsCount: client.valets_count || 0,
      loyaltyPoints: client.loyalty_points || 0,
      freeValets: client.free_valets || 0,
      lastVisit: client.last_visit
    }));
  } catch (error) {
    console.error('Error getting frequent clients:', error);
    return [];
  }
};

/**
 * Redeem loyalty points for a free valet
 */
export const redeemLoyaltyPoints = async (customerId: string, pointsToRedeem = 100): Promise<boolean> => {
  try {
    // First, get the current customer data
    const { data: customerData, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points, free_valets')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    // Check if the customer has enough points
    const loyaltyPoints = customerData?.loyalty_points || 0;
    
    if (loyaltyPoints < pointsToRedeem) {
      toast.error('El cliente no tiene suficientes puntos de fidelidad');
      return false;
    }
    
    // Calculate new values
    const freeValets = customerData?.free_valets || 0;
    const freeValetsToAdd = Math.floor(pointsToRedeem / 100);
    
    // Update the customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        loyalty_points: loyaltyPoints - pointsToRedeem,
        free_valets: freeValets + freeValetsToAdd
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    // Notify the user
    toast.success(`¡Puntos canjeados! Se han agregado ${freeValetsToAdd} valet${freeValetsToAdd > 1 ? 's' : ''} gratis`);
    
    return true;
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    return false;
  }
};
