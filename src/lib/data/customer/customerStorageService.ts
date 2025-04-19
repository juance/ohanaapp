
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';

// Types for local customer data
export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  freeValets: number;
  valetsRedeemed: number;
  lastVisit?: string;
  pendingSync?: boolean;
  synced?: boolean;
}

// Function to map database customer to model customer
const mapDatabaseCustomerToModel = (dbCustomer: any): Customer => {
  return {
    id: dbCustomer.id,
    name: dbCustomer.name || '',
    phone: dbCustomer.phone || '',
    phoneNumber: dbCustomer.phone || '', // For compatibility
    loyaltyPoints: dbCustomer.loyalty_points || 0,
    valetsCount: dbCustomer.valets_count || 0,
    freeValets: dbCustomer.free_valets || 0,
    createdAt: dbCustomer.created_at || new Date().toISOString(),
    updatedAt: dbCustomer.updated_at,
    lastVisit: dbCustomer.last_visit,
    valetsRedeemed: dbCustomer.valets_redeemed || 0
  };
};

/**
 * Store a customer in the local database and sync with Supabase
 * @param customerData Customer data to store
 */
export const storeCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
  try {
    const { phone, name } = customerData;
    
    if (!phone) {
      throw new Error('Phone number is required');
    }
    
    // Check if customer exists in Supabase
    const { data: existingCustomers, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone);
    
    if (error) throw error;
    
    // If customer exists, return it
    if (existingCustomers && existingCustomers.length > 0) {
      return mapDatabaseCustomerToModel(existingCustomers[0]);
    }
    
    // Customer doesn't exist, create a new one
    const { data: newCustomer, error: createError } = await supabase
      .from('customers')
      .insert([
        {
          phone,
          name: name || 'Cliente',
          loyalty_points: 0,
          free_valets: 0,
          valets_count: 0,
          valets_redeemed: 0,
          last_visit: new Date().toISOString()
        }
      ])
      .select();
    
    if (createError) throw createError;
    
    if (!newCustomer || newCustomer.length === 0) {
      throw new Error('Error creating customer');
    }
    
    return mapDatabaseCustomerToModel(newCustomer[0]);
  } catch (error) {
    console.error('Error storing customer:', error);
    throw error;
  }
};

/**
 * Get a customer by phone number
 * @param phone Phone number to search for
 */
export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  try {
    if (!phone) {
      throw new Error('Phone number is required');
    }
    
    // Search for customer in Supabase
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone);
    
    if (error) throw error;
    
    // Return the customer if found
    if (data && data.length > 0) {
      return mapDatabaseCustomerToModel(data[0]);
    }
    
    // Customer not found
    return null;
  } catch (error) {
    console.error('Error getting customer by phone:', error);
    throw error;
  }
};

/**
 * Update the last visit date for a customer
 * @param customerId Customer ID to update
 */
export const updateCustomerLastVisit = async (customerId: string): Promise<void> => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    // Update the last visit date in Supabase
    const { error } = await supabase
      .from('customers')
      .update({
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating customer last visit:', error);
    throw error;
  }
};
