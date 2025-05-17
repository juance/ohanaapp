
import { Customer } from '@/lib/types';
import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';

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
 * Save customers to local storage
 * @param customers Array of customers to save
 */
export const saveCustomersToLocalStorage = (customers: Customer[]): void => {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers to localStorage:', error);
  }
};

/**
 * Get all stored customers (alias for getCustomersFromLocalStorage)
 * @returns Array of customers
 */
export const getStoredCustomers = getCustomersFromLocalStorage;
