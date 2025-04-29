
import { Customer } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { getCustomerByPhone as getCustomerByPhoneStorage } from './customer/customerStorageService';
import { addLoyaltyPoints as addLoyaltyPointsDB, redeemLoyaltyPoints as redeemLoyaltyPointsDB } from './customer/loyaltyService';

/**
 * Get a customer by phone number
 * @param phone Phone number to search for
 */
export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  try {
    return await getCustomerByPhoneStorage(phone);
  } catch (error) {
    console.error('Error getting customer by phone:', error);
    throw error;
  }
};

/**
 * Add loyalty points to a customer
 * @param customerId Customer ID
 * @param points Points to add
 */
export const addLoyaltyPoints = async (customerId: string, points: number): Promise<number> => {
  try {
    return await addLoyaltyPointsDB(customerId, points);
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    throw error;
  }
};

/**
 * Redeem loyalty points for free valets
 * @param customerId Customer ID
 * @param points Points to redeem
 */
export const redeemLoyaltyPoints = async (
  customerId: string, 
  points: number
): Promise<{ remainingPoints: number, freeValets: number }> => {
  try {
    // Get current loyalty points and free valets
    const { data, error } = await supabase
      .from('customers')
      .select('loyalty_points, free_valets')
      .eq('id', customerId)
      .single();
    
    if (error) throw error;
    
    const currentPoints = data?.loyalty_points || 0;
    
    if (currentPoints < points) {
      throw new Error('Not enough loyalty points');
    }
    
    const newPoints = currentPoints - points;
    const newFreeValets = (data?.free_valets || 0) + 1;
    
    // Update the customer record
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        loyalty_points: newPoints,
        free_valets: newFreeValets
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return {
      remainingPoints: newPoints,
      freeValets: newFreeValets
    };
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    throw error;
  }
};

/**
 * Update customer valets count when creating a new ticket
 * @param customerId Customer ID
 * @param valetQuantity Number of valets to add
 */
export const updateValetsCount = async (customerId: string, valetQuantity: number): Promise<boolean> => {
  try {
    if (!customerId || valetQuantity <= 0) {
      return false;
    }

    // Direct update instead of using rpc increment which doesn't exist
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count')
      .eq('id', customerId)
      .single();
      
    if (getError) throw getError;
    
    const currentCount = customer?.valets_count || 0;
    const newCount = currentCount + valetQuantity;
    
    const { error } = await supabase
      .from('customers')
      .update({
        valets_count: newCount,
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating customer valets count:', error);
    toast.error('Error al actualizar conteo de valets');
    return false;
  }
};

// Export functions for use in the application
export {
  // Additional exports can go here
};
