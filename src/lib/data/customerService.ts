
// Re-export customer services from their respective files
export { storeCustomer } from './customer/customerStorageService';
export { getCustomerByPhone, getAllCustomers } from './customer/customerRetrievalService';
export { addLoyaltyPoints, redeemLoyaltyPoints } from './customer/loyaltyService';
export { updateValetsCount, useFreeValet } from './customer/valetService';
