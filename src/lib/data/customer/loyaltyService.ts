
import { supabase } from '@/integrations/supabase/client';

export const addLoyaltyPoints = async (customerId: string, points: number): Promise<boolean> => {
  try {
    // First get current points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer?.loyalty_points || 0;
    
    // Update with new points total
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: currentPoints + points })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    return false;
  }
};

export const redeemLoyaltyPoints = async (customerId: string, points: number): Promise<boolean> => {
  try {
    // First get current points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer?.loyalty_points || 0;
    
    // Ensure customer has enough points
    if (currentPoints < points) {
      return false;
    }
    
    // Update with new points total
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: currentPoints - points })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    return false;
  }
};
