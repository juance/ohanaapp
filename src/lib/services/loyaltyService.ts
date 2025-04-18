
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

// Add loyalty points to a customer
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
    throw error;
  }
};

// Redeem loyalty points for a reward
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
    return false;
  }
};

// Increment customer visit counter and potentially add loyalty points
export const incrementCustomerVisits = async (customerId: string, increment: number = 1): Promise<boolean> => {
  try {
    // Get current customer data
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count, loyalty_points')
      .eq('id', customerId)
      .single();

    if (getError) throw getError;

    const currentValets = customer?.valets_count || 0;
    const currentPoints = customer?.loyalty_points || 0;
    const newValetsCount = currentValets + increment;
    
    // Add loyalty points - 10 points per valet
    const pointsToAdd = increment * 10;
    const newPoints = currentPoints + pointsToAdd;

    // Update customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        valets_count: newValetsCount,
        loyalty_points: newPoints,
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error incrementing customer visits:', error);
    return false;
  }
};

// Hook for using customer's free valet capability
export const useCustomerFreeValet = (customerId: string, onSuccess: () => void) => {
  const useFreeValet = async () => {
    if (!customerId) {
      toast.error('No customer selected');
      return false;
    }

    try {
      // First, check if customer has free valets
      const { data: customer, error: getError } = await supabase
        .from('customers')
        .select('free_valets, valets_redeemed')
        .eq('id', customerId)
        .single();

      if (getError) throw getError;

      const freeValets = customer?.free_valets || 0;
      
      if (freeValets <= 0) {
        toast.error('Customer has no free valets available');
        return false;
      }

      // Use a free valet
      const newFreeValets = freeValets - 1;
      const newValetsRedeemed = (customer?.valets_redeemed || 0) + 1;

      const { error: updateError } = await supabase
        .from('customers')
        .update({
          free_valets: newFreeValets,
          valets_redeemed: newValetsRedeemed
        })
        .eq('id', customerId);

      if (updateError) throw updateError;

      toast.success(`Free valet used! ${newFreeValets} remaining`);
      onSuccess();
      return true;
    } catch (error) {
      console.error('Error using free valet:', error);
      toast.error('Failed to use free valet');
      return false;
    }
  };

  return { useFreeValet };
};
