
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';
import { storeCustomer, getCustomerByPhone, updateCustomerLastVisit } from './customerStorageService';
import { getCustomerValetCount, useFreeValet } from './valetService';

/**
 * Add loyalty points to a customer
 * @param customerId Customer ID to add points to
 * @param points Number of points to add
 */
export const addLoyaltyPoints = async (customerId: string, points: number): Promise<number> => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    if (points <= 0) {
      throw new Error('Points must be greater than 0');
    }
    
    // Get current loyalty points
    const { data, error } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (error) throw error;
    
    const currentPoints = data?.loyalty_points || 0;
    const newPoints = currentPoints + points;
    
    // Update the customer record
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        loyalty_points: newPoints
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return newPoints;
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    throw error;
  }
};

/**
 * Re-export functions from customerStorageService
 */
export { storeCustomer, getCustomerByPhone, updateCustomerLastVisit };

/**
 * Re-export functions from valetService
 */
export { getCustomerValetCount, useFreeValet };

/**
 * Redeem loyalty points for free valets
 * @param customerId Customer ID to redeem points for
 * @param pointsToRedeem Number of points to redeem
 * @param valetsToAdd Number of valets to add (usually 1)
 */
export const redeemLoyaltyPoints = async (
  customerId: string,
  pointsToRedeem: number,
  valetsToAdd: number = 1
): Promise<{ remainingPoints: number, freeValets: number }> => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    if (pointsToRedeem <= 0) {
      throw new Error('Points to redeem must be greater than 0');
    }
    
    // Get current loyalty points and free valets
    const { data, error } = await supabase
      .from('customers')
      .select('loyalty_points, free_valets')
      .eq('id', customerId)
      .single();
    
    if (error) throw error;
    
    const currentPoints = data?.loyalty_points || 0;
    
    // Check if customer has enough points
    if (currentPoints < pointsToRedeem) {
      throw new Error('Not enough loyalty points');
    }
    
    const newPoints = currentPoints - pointsToRedeem;
    const newFreeValets = (data?.free_valets || 0) + valetsToAdd;
    
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
