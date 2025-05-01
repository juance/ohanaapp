
import { toast } from '@/lib/toast';
import { logError } from '@/lib/errorHandlingService';

/**
 * Handle validation errors during form validation
 */
export const handleValidationError = (
  message: string,
  field?: string,
  value?: any
): void => {
  logError(
    `Validation error: ${message}`,
    { field, value, type: 'validation' }
  );

  toast.error(message);
};

/**
 * Validate customer information
 * @param name Customer name
 * @param phone Phone number
 * @returns true if valid, false otherwise
 */
export const validateCustomer = (name: string, phone: string): boolean => {
  if (!name.trim()) {
    handleValidationError('El nombre del cliente es requerido', 'name', name);
    return false;
  }

  if (!phone.trim()) {
    handleValidationError('El teléfono del cliente es requerido', 'phone', phone);
    return false;
  }

  return true;
};

/**
 * Validate ticket information
 * @param ticketData Ticket data object
 * @returns true if valid, false otherwise
 */
export const validateTicket = (ticketData: any): boolean => {
  if (!ticketData.clientName?.trim()) {
    handleValidationError('El nombre del cliente es requerido', 'clientName', ticketData.clientName);
    return false;
  }

  if (!ticketData.phoneNumber?.trim()) {
    handleValidationError('El teléfono del cliente es requerido', 'phoneNumber', ticketData.phoneNumber);
    return false;
  }

  if (ticketData.totalPrice === undefined || ticketData.totalPrice < 0) {
    handleValidationError('El precio total debe ser un número positivo', 'totalPrice', ticketData.totalPrice);
    return false;
  }

  if (!ticketData.paymentMethod) {
    handleValidationError('El método de pago es requerido', 'paymentMethod', ticketData.paymentMethod);
    return false;
  }

  return true;
};

/**
 * Validate expense information
 * @param expenseData Expense data object
 * @returns true if valid, false otherwise
 */
export const validateExpense = (expenseData: any): boolean => {
  if (!expenseData.description?.trim()) {
    handleValidationError('La descripción del gasto es requerida', 'description', expenseData.description);
    return false;
  }

  if (expenseData.amount === undefined || expenseData.amount <= 0) {
    handleValidationError('El monto debe ser mayor que cero', 'amount', expenseData.amount);
    return false;
  }

  if (!expenseData.category?.trim()) {
    handleValidationError('La categoría es requerida', 'category', expenseData.category);
    return false;
  }

  return true;
};

/**
 * Validate feedback information
 * @param feedbackData Feedback data object
 * @returns true if valid, false otherwise
 */
export const validateFeedback = (feedbackData: any): boolean => {
  if (!feedbackData.customerName?.trim()) {
    handleValidationError('El nombre del cliente es requerido', 'customerName', feedbackData.customerName);
    return false;
  }

  if (feedbackData.rating === undefined || feedbackData.rating < 1 || feedbackData.rating > 5) {
    handleValidationError('La calificación debe estar entre 1 y 5', 'rating', feedbackData.rating);
    return false;
  }

  if (!feedbackData.comment?.trim()) {
    handleValidationError('El comentario es requerido', 'comment', feedbackData.comment);
    return false;
  }

  return true;
};
