
import { Customer } from '@/lib/types';
import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';

/**
 * Store or update customer to local storage
 * @param customer Customer to save or update
 * @returns The stored customer
 */
export const storeCustomer = (customer: Partial<Customer>): Customer | null => {
  try {
    if (!customer.id) {
      // Generate id if not provided
      customer.id = crypto.randomUUID();
    }

    // Get all customers
    const customers = getCustomersFromLocalStorage();
    
    // Find if customer exists
    const existingIndex = customers.findIndex(c => c.id === customer.id || 
      (c.phone === customer.phone || c.phone_number === customer.phone_number));
    
    let updatedCustomer: Customer;
    
    if (existingIndex >= 0) {
      // Update existing customer
      updatedCustomer = {
        ...customers[existingIndex],
        ...customer,
        phone: customer.phone || customer.phone_number || customers[existingIndex].phone,
        phone_number: customer.phone_number || customer.phone || customers[existingIndex].phone_number
      } as Customer;
      
      customers[existingIndex] = updatedCustomer;
    } else {
      // Create new customer
      updatedCustomer = {
        id: customer.id || crypto.randomUUID(),
        name: customer.name || '',
        phone: customer.phone || customer.phone_number || '',
        phone_number: customer.phone_number || customer.phone || '',
        loyalty_points: customer.loyalty_points || 0,
        valets_count: customer.valets_count || 0,
        free_valets: customer.free_valets || 0,
        last_visit: customer.last_visit || new Date().toISOString(),
        valets_redeemed: customer.valets_redeemed || 0,
        created_at: customer.created_at || new Date().toISOString()
      };
      
      customers.push(updatedCustomer);
    }
    
    // Save back to local storage
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    
    return updatedCustomer;
  } catch (error) {
    console.error('Error storing customer:', error);
    return null;
  }
};

/**
 * Get all customers from local storage
 * @returns Array of customers
 */
export const getCustomersFromLocalStorage = (): Customer[] => {
  const customersString = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  if (!customersString) return [];
  
  try {
    const customers = JSON.parse(customersString);
    
    // Map each customer to ensure all fields are present
    return customers.map((customer: any) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      phone_number: customer.phone_number || customer.phone,
      valets_count: customer.valets_count || 0,
      free_valets: customer.free_valets || 0,
      last_visit: customer.last_visit,
      loyalty_points: customer.loyalty_points || 0,
      created_at: customer.created_at,
      valets_redeemed: customer.valets_redeemed || 0
    }));
  } catch (error) {
    console.error('Error parsing customers from localStorage:', error);
    return [];
  }
};

/**
 * Get customer from local storage by phone number
 * @param phone Phone number to look for
 * @returns Customer with the given phone number
 */
export const getCustomerByPhone = (phone: string): Customer | null => {
  const customers = getCustomersFromLocalStorage();
  return customers.find(c => c.phone === phone || c.phone_number === phone) || null;
};

/**
 * Update customer's last visit date
 * @param customerId Customer ID
 * @param date Last visit date
 */
export const updateCustomerLastVisit = async (customerId: string, date: string): Promise<void> => {
  const { supabase } = await import('@/integrations/supabase/client');
  try {
    // Update in database
    const { error } = await supabase
      .from('customers')
      .update({ last_visit: date })
      .eq('id', customerId);
    
    if (error) {
      console.error('Error updating customer last visit in database:', error);
      throw error;
    }
    
    // Update in local storage
    const customers = getCustomersFromLocalStorage();
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex >= 0) {
      customers[customerIndex].last_visit = date;
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    }
  } catch (error) {
    console.error('Error updating customer last visit:', error);
    throw error;
  }
};

/**
 * Alias for storeCustomer to maintain compatibility with older code
 */
export const storeOrUpdateCustomer = storeCustomer;

/**
 * Get all stored customers
 * @returns Array of customers
 */
export const getStoredCustomers = getCustomersFromLocalStorage;
