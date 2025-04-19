
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';

/**
 * Get the number of valets a customer has used and free valets available
 * @param customerId Customer ID to check
 */
export const getCustomerValetCount = async (customerId: string): Promise<{ count: number, free: number }> => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    const { data, error } = await supabase
      .from('customers')
      .select('valets_count, free_valets')
      .eq('id', customerId)
      .single();
    
    if (error) throw error;
    
    return {
      count: data.valets_count || 0,
      free: data.free_valets || 0
    };
  } catch (error) {
    console.error('Error getting customer valet count:', error);
    return { count: 0, free: 0 };
  }
};

/**
 * Use a free valet for a customer
 * @param customerId Customer ID to use a free valet for
 */
export const useFreeValet = async (customerId: string): Promise<boolean> => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    // Get current free valets
    const { data, error } = await supabase
      .from('customers')
      .select('free_valets, valets_redeemed')
      .eq('id', customerId)
      .single();
    
    if (error) throw error;
    
    // Check if customer has free valets
    if (!data || (data.free_valets || 0) <= 0) {
      throw new Error('No free valets available');
    }
    
    // Update the customer record
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        free_valets: Math.max((data.free_valets || 0) - 1, 0),
        valets_redeemed: (data.valets_redeemed || 0) + 1
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error using free valet:', error);
    throw error;
  }
};
