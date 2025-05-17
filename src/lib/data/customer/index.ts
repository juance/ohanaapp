
// Re-export customer-related functionality
export * from './customerLocalStorage';
export * from './customerManager';
export * from './customerVisitTracker';
// Explicitly re-export to resolve ambiguity
export { getCustomerByPhone as getCustomerByPhoneRetrieval } from './customerRetrievalService';
export * from './loyaltyService';
export * from './valetService';
export * from './phoneUtils';
