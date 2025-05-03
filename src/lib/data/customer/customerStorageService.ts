
import { Customer, ClientVisit } from '@/lib/types';
import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';

export function storeCustomer(customer: Customer): void {
  try {
    // Get existing customers
    const existingCustomers = getStoredCustomers();
    
    // Check if customer already exists
    const customerIndex = existingCustomers.findIndex(c => c.id === customer.id);
    
    if (customerIndex >= 0) {
      // Update existing customer
      existingCustomers[customerIndex] = customer;
    } else {
      // Add new customer
      existingCustomers.push(customer);
    }
    
    // Save to local storage
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(existingCustomers));
  } catch (error) {
    console.error('Error storing customer:', error);
  }
}

export function getStoredCustomers(): Customer[] {
  try {
    const customersJson = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!customersJson) return [];
    
    const customers = JSON.parse(customersJson);
    return customers.map((customer: any) => ({
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      phone: customer.phone || customer.phoneNumber, // Ensure phone is always set
      valetsCount: customer.valetsCount || 0,
      freeValets: customer.freeValets || 0,
      lastVisit: customer.lastVisit,
      loyaltyPoints: customer.loyaltyPoints || 0,
      createdAt: customer.createdAt || new Date().toISOString(),
      valetsRedeemed: customer.valetsRedeemed || 0
    }));
  } catch (error) {
    console.error('Error getting stored customers:', error);
    return [];
  }
}

export function getCustomerByPhone(phoneNumber: string): Customer | null {
  try {
    const customers = getStoredCustomers();
    const customer = customers.find(c => 
      c.phone === phoneNumber || c.phoneNumber === phoneNumber
    );
    return customer || null;
  } catch (error) {
    console.error('Error finding customer by phone:', error);
    return null;
  }
}

export function updateCustomer(customer: Customer): boolean {
  try {
    const customers = getStoredCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    
    if (index === -1) return false;
    
    customers[index] = {
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      phone: customer.phone,
      loyaltyPoints: customer.loyaltyPoints,
      valetsCount: customer.valetsCount,
      freeValets: customer.freeValets,
      createdAt: customer.createdAt,
      lastVisit: customer.lastVisit,
      valetsRedeemed: customer.valetsRedeemed
    };
    
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    return true;
  } catch (error) {
    console.error('Error updating customer:', error);
    return false;
  }
}

export function storeOrUpdateCustomer(customer: Partial<Customer>): Customer {
  const customers = getStoredCustomers();
  const existingCustomer = customers.find(
    c => c.phone === customer.phone || c.phoneNumber === customer.phoneNumber
  );
  
  if (existingCustomer) {
    const updatedCustomer = {
      ...existingCustomer,
      ...customer,
      lastVisit: new Date().toISOString()
    };
    updateCustomer(updatedCustomer);
    return updatedCustomer;
  }
  
  const newCustomer: Customer = {
    id: crypto.randomUUID(),
    name: customer.name || '',
    phoneNumber: customer.phoneNumber || '',
    phone: customer.phone || customer.phoneNumber || '',
    loyaltyPoints: customer.loyaltyPoints || 0,
    valetsCount: customer.valetsCount || 0,
    freeValets: customer.freeValets || 0,
    createdAt: new Date().toISOString(),
    lastVisit: customer.lastVisit || new Date().toISOString(),
    valetsRedeemed: customer.valetsRedeemed || 0
  };
  
  storeCustomer(newCustomer);
  return newCustomer;
}
