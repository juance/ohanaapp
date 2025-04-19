
// Central data service that combines functionality from other data services
import { storeCustomer, getCustomerByPhone } from './data/customer/customerStorageService';
import { createTicket, getPickupTickets, getRecentTickets, storeTicket } from './data/ticket/ticketStorageService';
import { storeExpense, getStoredExpenses } from './data/expenseService';
import { analyzeTickets, analyzeCustomers, analyzeRevenue, getClientVisitFrequency } from './data/analysisService';
import { addLoyaltyPoints, redeemLoyaltyPoints } from './data/customer/loyaltyService';

// Re-export all service functions for easy access
export {
  // Customer services
  storeCustomer,
  getCustomerByPhone,
  
  // Ticket services
  createTicket,
  getPickupTickets,
  getRecentTickets,
  storeTicket,
  
  // Expense services
  storeExpense,
  getStoredExpenses,
  
  // Analysis services
  analyzeTickets,
  analyzeCustomers,
  analyzeRevenue,
  getClientVisitFrequency,
  
  // Loyalty services
  addLoyaltyPoints,
  redeemLoyaltyPoints
};
