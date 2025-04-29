
// Core data utilities for storage operations

/**
 * Save data to localStorage
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Retrieve data from localStorage
 */
export const getFromLocalStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return [];
  }
};

// Storage keys constants
export const TICKETS_STORAGE_KEY = 'laundry_tickets';
export const EXPENSES_STORAGE_KEY = 'laundry_expenses';
export const CLIENT_STORAGE_KEY = 'laundry_clients';
export const FEEDBACK_STORAGE_KEY = 'laundry_feedback';

// Utility to convert payment method to the format expected by the database
export const formatPaymentMethod = (method: string): "cash" | "debit" | "mercadopago" | "cuentadni" => {
  if (method === "cuenta_dni") return "cuentadni";
  if (method === "mercadopago") return "mercadopago";
  return method as "cash" | "debit";
};
