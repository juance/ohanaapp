
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';

/**
 * Save a customer to local storage
 * @param customer Customer to save
 */
export const saveCustomerToLocalStorage = (customer: Customer): void => {
  const customers = getCustomersFromLocalStorage();
  
  // Check if customer already exists
  const existingCustomerIndex = customers.findIndex(c => c.id === customer.id);
  
  if (existingCustomerIndex >= 0) {
    // Update existing customer
    customers[existingCustomerIndex] = customer;
  } else {
    // Add new customer
    customers.push(customer);
  }
  
  // Save to local storage
  localStorage.setItem('customers', JSON.stringify(customers));
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
 * Update customer in database and local storage
 * @param customer Customer to update
 */
export const updateCustomer = async (customer: Customer): Promise<void> => {
  try {
    // Update in database
    const { error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        phone: customer.phone,
        loyalty_points: customer.loyaltyPoints,
        valets_count: customer.valetsCount,
        free_valets: customer.freeValets,
        last_visit: customer.lastVisit,
        valets_redeemed: customer.valetsRedeemed
      })
      .eq('id', customer.id);
    
    if (error) {
      console.error('Error updating customer in database:', error);
      throw error;
    }
    
    // Update in local storage
    saveCustomerToLocalStorage(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
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
