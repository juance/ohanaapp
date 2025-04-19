
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
 * @param valets Number of valets to add
 */
export const redeemLoyaltyPoints = async (
  customerId: string, 
  points: number, 
  valets: number = 1
): Promise<{ remainingPoints: number, freeValets: number }> => {
  try {
    return await redeemLoyaltyPointsDB(customerId, points, valets);
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

    const { error } = await supabase
      .from('customers')
      .update({
        valets_count: supabase.rpc('increment', { row_id: customerId, column_name: 'valets_count', increment_amount: valetQuantity }),
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
