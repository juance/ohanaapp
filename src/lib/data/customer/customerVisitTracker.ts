
import { supabase } from '@/integrations/supabase/client';
import { getCustomersFromLocalStorage, saveCustomersToLocalStorage } from './customerLocalStorage';

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
      saveCustomersToLocalStorage(customers);
    }
  } catch (error) {
    console.error('Error updating customer last visit:', error);
    throw error;
  }
};
