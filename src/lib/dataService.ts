// src/lib/dataService.ts
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';

// Function to get the next ticket number
export const getNextTicketNumber = async (): Promise<string | null> => {
  try {
    // Use the stored procedure to get the next ticket number
    const { data, error } = await supabase.rpc('get_next_ticket_number');
    
    if (error) {
      console.error('Error getting next ticket number:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getNextTicketNumber:', error);
    return null;
  }
};

// Function to increment valets count - we won't use RPC since it doesn't exist
export const incrementValetsCount = async (customerId: string, quantity: number = 1): Promise<number> => {
  try {
    // First, get current value
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('valets_count')
      .eq('id', customerId)
      .single();
      
    if (fetchError) {
      console.error('Error getting customer valets count:', fetchError);
      return 0;
    }
    
    const currentCount = customer?.valets_count || 0;
    const newCount = currentCount + quantity;
    
    // Now update
    const { error: updateError } = await supabase
      .from('customers')
      .update({ valets_count: newCount })
      .eq('id', customerId);
      
    if (updateError) {
      console.error('Error updating valets count:', updateError);
      return 0;
    }
    
    return newCount;
  } catch (error) {
    console.error('Error in incrementValetsCount:', error);
    return 0;
  }
};

/**
 * Get a customer by ID
 * @param customerId Customer ID
 * @returns Customer object if found, null otherwise
 */
export const getCustomerById = async (customerId: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error getting customer by ID:', error);
      return null;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    return null;
  }
};

/**
 * Get a customer by phone number
 * @param phoneNumber Phone number
 * @returns Customer object if found, null otherwise
 */
export const getUserByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    if (error) {
      console.error('Error getting customer by phone:', error);
      return null;
    }

    return data as Customer;
  } catch (error) {
    console.error('Error in getUserByPhone:', error);
    return null;
  }
};
