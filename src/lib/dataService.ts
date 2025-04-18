
// Central data service that combines functionality from other data services
import { createCustomer, getClientDetails } from './data/customer/customerService';
import { createTicket, getPickupTickets, getRecentTickets } from './ticketService';
import { storeExpense, getStoredExpenses } from './data/expenseService';
import { analyzeTickets, analyzeCustomers, analyzeRevenue, getClientVisitFrequency } from './data/analysisService';

// Re-export all service functions for easy access
export {
  // Customer services
  createCustomer,
  getClientDetails,
  
  // Ticket services
  createTicket,
  getPickupTickets,
  getRecentTickets,
  
  // Expense services
  storeExpense,
  getStoredExpenses,
  
  // Analysis services
  analyzeTickets,
  analyzeCustomers,
  analyzeRevenue,
  getClientVisitFrequency
};
