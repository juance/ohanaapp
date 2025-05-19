
import { Customer } from '@/lib/types';
import { getCustomersFromLocalStorage, saveCustomersToLocalStorage } from './customerLocalStorage';

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
    saveCustomersToLocalStorage(customers);
    
    return updatedCustomer;
  } catch (error) {
    console.error('Error storing customer:', error);
    return null;
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
 * Alias for storeCustomer to maintain compatibility with older code
 */
export const storeOrUpdateCustomer = storeCustomer;
