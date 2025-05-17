
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
      (c.phone === customer.phone || c.phoneNumber === customer.phoneNumber));
    
    let updatedCustomer: Customer;
    
    if (existingIndex >= 0) {
      // Update existing customer
      updatedCustomer = {
        ...customers[existingIndex],
        ...customer,
        phone: customer.phone || customer.phoneNumber || customers[existingIndex].phone,
        phoneNumber: customer.phoneNumber || customer.phone || customers[existingIndex].phoneNumber
      } as Customer;
      
      customers[existingIndex] = updatedCustomer;
    } else {
      // Create new customer
      updatedCustomer = {
        id: customer.id || crypto.randomUUID(),
        name: customer.name || '',
        phone: customer.phone || customer.phoneNumber || '',
        phoneNumber: customer.phoneNumber || customer.phone || '',
        loyaltyPoints: customer.loyaltyPoints || 0,
        valetsCount: customer.valetsCount || 0,
        freeValets: customer.freeValets || 0,
        lastVisit: customer.lastVisit || new Date().toISOString(),
        valetsRedeemed: customer.valetsRedeemed || 0,
        createdAt: customer.createdAt || new Date().toISOString()
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
  return customers.find(c => c.phone === phone || c.phoneNumber === phone) || null;
};

/**
 * Alias for storeCustomer to maintain compatibility with older code
 */
export const storeOrUpdateCustomer = storeCustomer;
