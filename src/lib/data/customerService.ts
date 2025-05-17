
// Import the proper functions from the refactored files
import { getCustomersFromLocalStorage, saveCustomersToLocalStorage } from './customer/customerLocalStorage';
import { updateCustomerLastVisit } from './customer/customerVisitTracker';
import { Customer } from '@/lib/types';

/**
 * Store a customer in local storage
 * @param customer Customer to store
 */
export const storeCustomer = (customer: Customer): void => {
  const customers = getCustomersFromLocalStorage();
  const existingCustomerIndex = customers.findIndex(c => c.id === customer.id);
  
  if (existingCustomerIndex >= 0) {
    customers[existingCustomerIndex] = customer;
  } else {
    customers.push(customer);
  }
  
  saveCustomersToLocalStorage(customers);
};

// Export other functions from the original service that might be needed
export { getCustomersFromLocalStorage, updateCustomerLastVisit };
