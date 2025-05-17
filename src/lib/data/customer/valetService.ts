
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';
import { getCustomerByPhone } from './customerStorageService';

/**
 * Get customer valet count from database
 * @param customerId Customer ID to check
 * @returns Number of valets used
 */
export const getCustomerValetCount = async (customerId: string): Promise<number> => {
  try {
    // Get from database
    const { data, error } = await supabase
      .from('customers')
      .select('valets_count')
      .eq('id', customerId)
      .single();
    
    if (error) {
      console.error('Error getting customer valet count:', error);
      throw error;
    }
    
    return data?.valets_count || 0;
  } catch (error) {
    console.error('Error getting customer valet count:', error);
    return 0;
  }
};

/**
 * Use a free valet for a customer
 * @param customerId Customer ID
 * @returns Updated free valets count
 */
export const useFreeValet = async (customerId: string): Promise<number> => {
  try {
    // Get customer free valets count
    const { data, error } = await supabase
      .from('customers')
      .select('free_valets, valets_redeemed')
      .eq('id', customerId)
      .single();
    
    if (error) {
      console.error('Error getting customer free valets count:', error);
      throw error;
    }
    
    if (!data || data.free_valets <= 0) {
      throw new Error('No hay vales gratuitos disponibles');
    }
    
    // Subtract one free valet
    const newFreeValets = data.free_valets - 1;
    
    // Update customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        free_valets: newFreeValets,
        valets_redeemed: data.valets_redeemed ? data.valets_redeemed + 1 : 1
      })
      .eq('id', customerId);
    
    if (updateError) {
      console.error('Error updating customer free valets:', updateError);
      throw updateError;
    }
    
    return newFreeValets;
  } catch (error) {
    console.error('Error using free valet:', error);
    throw error;
  }
};
