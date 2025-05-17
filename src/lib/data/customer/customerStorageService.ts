
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';

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
    localStorage.setItem('customers', JSON.stringify(customers));
    
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
 * Get all customers from local storage
 * @returns Array of customers
 */
export const getCustomersFromLocalStorage = (): Customer[] => {
  const customersString = localStorage.getItem('customers');
  if (!customersString) return [];
  
  try {
    const customers = JSON.parse(customersString);
    
    // Map each customer to ensure all fields are present
    return customers.map((customer: any) => ({
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      phone: customer.phone,
      valetsCount: customer.valetsCount || 0,
      freeValets: customer.freeValets || 0,
      lastVisit: customer.lastVisit,
      loyaltyPoints: customer.loyaltyPoints || 0,
      createdAt: customer.createdAt,
      valetsRedeemed: customer.valetsRedeemed || 0
    }));
  } catch (error) {
    console.error('Error parsing customers from localStorage:', error);
    return [];
  }
};

/**
 * Update customer's last visit date
 * @param customerId Customer ID
 * @param date Last visit date
 */
export const updateCustomerLastVisit = async (customerId: string, date: string): Promise<void> => {
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
      customers[customerIndex].lastVisit = date;
      localStorage.setItem('customers', JSON.stringify(customers));
    }
  } catch (error) {
    console.error('Error updating customer last visit:', error);
    throw error;
  }
};

/**
 * Get all stored customers
 * @returns Array of customers
 */
export const getStoredCustomers = getCustomersFromLocalStorage;
