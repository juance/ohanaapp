
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '@/lib/types';

// Store a customer in localStorage
export const storeCustomerInLocalStorage = (name: string, phoneNumber: string): Customer => {
  try {
    // Check if customer already exists by phone number
    const existingCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    const existingCustomer = existingCustomers.find(c => c.phone === phoneNumber);
    
    if (existingCustomer) {
      // Update last visit
      existingCustomer.lastVisit = new Date().toISOString();
      localStorage.setItem('customers', JSON.stringify(existingCustomers));
      return existingCustomer;
    }
    
    // Create new customer
    const newCustomer: Customer = {
      id: uuidv4(),
      name,
      phone: phoneNumber,
      phoneNumber,
      lastVisit: new Date().toISOString(),
      valetsCount: 0,
      freeValets: 0,
      loyaltyPoints: 0,
      valetsRedeemed: 0,
      createdAt: new Date().toISOString()
    };
    
    // Add to customer list
    existingCustomers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(existingCustomers));
    
    return newCustomer;
  } catch (error) {
    console.error('Error storing customer:', error);
    throw new Error('Failed to store customer');
  }
};

// Update a customer's last visit
export const updateCustomerLastVisitInLocalStorage = (phoneNumber: string): Customer | null => {
  try {
    const existingCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    const customerIndex = existingCustomers.findIndex(c => c.phone === phoneNumber);
    
    if (customerIndex < 0) {
      return null;
    }
    
    existingCustomers[customerIndex].lastVisit = new Date().toISOString();
    localStorage.setItem('customers', JSON.stringify(existingCustomers));
    
    return existingCustomers[customerIndex];
  } catch (error) {
    console.error('Error updating customer visit:', error);
    throw new Error('Failed to update customer visit');
  }
};

// Compatibility exports
export const storeCustomer = storeCustomerInLocalStorage;
export const updateCustomerLastVisit = updateCustomerLastVisitInLocalStorage;

// Get customer from localStorage by phone number
export const getCustomerByPhoneFromLocalStorage = (phoneNumber: string): Customer | null => {
  try {
    const existingCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = existingCustomers.find(c => c.phone === phoneNumber);
    return customer || null;
  } catch (error) {
    console.error('Error getting customer:', error);
    return null;
  }
};

// Map database customer to client model
export const mapDatabaseCustomerToModel = (dbCustomer: any): Customer => {
  return {
    id: dbCustomer.id,
    name: dbCustomer.name,
    phoneNumber: dbCustomer.phone,
    phone: dbCustomer.phone,
    loyaltyPoints: dbCustomer.loyalty_points || 0,
    valetsCount: dbCustomer.valets_count || 0,
    freeValets: dbCustomer.free_valets || 0,
    createdAt: dbCustomer.created_at,
    lastVisit: dbCustomer.last_visit,
    valetsRedeemed: dbCustomer.valets_redeemed || 0
  };
};
