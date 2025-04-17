
import { supabase } from '@/integrations/supabase/client';
import { isAfter, subDays } from 'date-fns';

// Check if a customer is eligible for loyalty program
export const checkCustomerLoyalty = async (phoneNumber: string): Promise<{
  isEligible: boolean;
  valetsCount: number;
  freeValets: number;
  lastResetDate?: Date;
}> => {
  try {
    // Get customer information
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    if (error) {
      console.error('Error checking customer loyalty:', error);
      return {
        isEligible: false,
        valetsCount: 0,
        freeValets: 0
      };
    }

    // Check if customer exists
    if (!customer) {
      return {
        isEligible: false,
        valetsCount: 0,
        freeValets: 0
      };
    }

    // Return customer loyalty status
    return {
      isEligible: true,
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      lastResetDate: customer.last_reset_date ? new Date(customer.last_reset_date) : undefined
    };
  } catch (error) {
    console.error('Error in checkCustomerLoyalty:', error);
    return {
      isEligible: false,
      valetsCount: 0,
      freeValets: 0
    };
  }
};

export const updateValetsCount = async (customerId: string, valetQuantity: number): Promise<boolean> => {
  try {
    // First get the current customer data
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count, free_valets')
      .eq('id', customerId)
      .single();

    if (getError) throw getError;

    const currentValets = customer?.valets_count || 0;
    let currentFreeValets = customer?.free_valets || 0;

    // Check if we need to reset counter (first day of month)
    const now = new Date();
    
    // Get current month's count directly
    let newTotalValets = currentValets + valetQuantity;

    // For every 9 valets completed, grant 1 free valet
    // Free valets are not reset monthly, only the counter
    const newFreeValetsEarned = Math.floor(newTotalValets / 9) - Math.floor(currentValets / 9);
    const newFreeValets = currentFreeValets + newFreeValetsEarned;

    // Update in database
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        valets_count: newTotalValets,
        free_valets: newFreeValets
      })
      .eq('id', customerId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error updating valets count:', error);
    return false;
  }
};

export const useFreeValet = async (customerId: string): Promise<boolean> => {
  try {
    // First verify if customer has free valets available
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('free_valets')
      .eq('id', customerId)
      .single();

    if (getError) throw getError;

    const freeValets = customer?.free_valets || 0;

    // If no free valets available, return error
    if (freeValets <= 0) {
      return false;
    }

    // Update reducing free valets by 1
    const { error: updateError } = await supabase
      .from('customers')
      .update({ free_valets: freeValets - 1 })
      .eq('id', customerId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error using free valet:', error);
    return false;
  }
};

// Add the missing getCustomerValetCount function
export const getCustomerValetCount = async (customerId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('valets_count')
      .eq('id', customerId)
      .single();

    if (error) throw error;
    return data?.valets_count || 0;
  } catch (error) {
    console.error('Error getting customer valet count:', error);
    return 0;
  }
};
