
import { Customer } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage, CLIENT_STORAGE_KEY } from '../coreUtils';

// Create a new customer
export const createCustomer = async (customerData: Partial<Customer>): Promise<Customer | null> => {
  try {
    // Try to create in Supabase first
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: customerData.name,
        phone: customerData.phoneNumber || customerData.phone,
        valets_count: customerData.valetsCount || 0,
        free_valets: customerData.freeValets || 0,
        last_visit: customerData.lastVisit || new Date().toISOString()
      }])
      .select('*')
      .single();

    if (error) throw error;
    
    // Map the Supabase response to our Customer type
    const customer: Customer = {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      phone: data.phone,
      lastVisit: data.last_visit,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      loyaltyPoints: (data.valets_count || 0) * 10,
      createdAt: data.created_at
    };
    
    return customer;
  } catch (error) {
    console.error('Error creating customer in Supabase:', error);
    
    // Fallback to local storage
    try {
      // Get existing customers
      const customers = getFromLocalStorage<Customer>(CLIENT_STORAGE_KEY) || [];
      
      // Create new customer
      const newCustomer: Customer = {
        id: `local-${Date.now()}`,
        name: customerData.name || '',
        phoneNumber: customerData.phoneNumber || customerData.phone || '',
        phone: customerData.phoneNumber || customerData.phone || '',
        valetsCount: customerData.valetsCount || 0,
        freeValets: customerData.freeValets || 0,
        lastVisit: customerData.lastVisit || new Date().toISOString(),
        loyaltyPoints: (customerData.valetsCount || 0) * 10,
        createdAt: new Date().toISOString()
      };
      
      // Add to array and save
      const updatedCustomers = Array.isArray(customers) ? [...customers, newCustomer] : [newCustomer];
      saveToLocalStorage(CLIENT_STORAGE_KEY, updatedCustomers);
      
      return newCustomer;
    } catch (localError) {
      console.error('Error creating customer in local storage:', localError);
      return null;
    }
  }
};

// Function to map database customer to model customer
const mapDatabaseCustomerToModel = (dbCustomer: any): Customer => {
  return {
    id: dbCustomer.id,
    name: dbCustomer.name || '',
    phoneNumber: dbCustomer.phone || '',
    phone: dbCustomer.phone || '', // For compatibility
    loyaltyPoints: dbCustomer.loyalty_points || 0,
    valetsCount: dbCustomer.valets_count || 0,
    freeValets: dbCustomer.free_valets || 0,
    createdAt: dbCustomer.created_at || new Date().toISOString(),
    lastVisit: dbCustomer.last_visit
  };
};

/**
 * Store a customer in the local database and sync with Supabase
 * @param customerData Customer data to store
 */
export const storeCustomer = async (customerData: Partial<Customer>): Promise<Customer> => {
  try {
    // Accept both 'phone' and 'phoneNumber' for greater compatibility
    const phone = customerData.phone || customerData.phoneNumber;
    const { name } = customerData;

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

    // Clean the phone number for searching (remove non-numeric characters)
    const cleanedPhone = phone.replace(/\D/g, '');

    // Search by phone number using LIKE for a more flexible search
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`phone.ilike.%${cleanedPhone}%,phone.ilike.%${phone}%`);

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
