
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/lib/errorService';

/**
 * Add loyalty points to a customer
 * @param customerId The ID of the customer
 * @param points The number of points to add
 * @returns The new total points or 0 if an error occurred
 */
export const addLoyaltyPoints = async (customerId: string, points: number): Promise<number> => {
  try {
    // First, get current loyalty points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer?.loyalty_points || 0;
    const newPoints = currentPoints + points;
    
    // Update loyalty points
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: newPoints })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return newPoints;
  } catch (error) {
    console.error('Error in addLoyaltyPoints:', error);
    logError(error, { context: 'addLoyaltyPoints' });
    return 0;
  }
};

/**
 * Redeem loyalty points for a reward
 * @param customerId The ID of the customer
 * @param pointsToRedeem The number of points to redeem
 * @returns True if redemption was successful, false otherwise
 */
export const redeemLoyaltyPoints = async (customerId: string, pointsToRedeem: number): Promise<boolean> => {
  try {
    // First, get current loyalty points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer?.loyalty_points || 0;
    
    // Ensure customer has enough points
    if (currentPoints < pointsToRedeem) {
      return false;
    }
    
    const newPoints = currentPoints - pointsToRedeem;
    
    // Update loyalty points
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: newPoints })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error in redeemLoyaltyPoints:', error);
    logError(error, { context: 'redeemLoyaltyPoints' });
    return false;
  }
};
