
import { z } from 'zod';
import { handleValidationError } from './errorHandlingService';
import { VALIDATION } from './constants/appConstants';

// Customer validation schema
const customerSchema = z.object({
  name: z.string().min(VALIDATION.MIN_NAME_LENGTH, { 
    message: `El nombre debe tener al menos ${VALIDATION.MIN_NAME_LENGTH} caracteres` 
  }),
  phoneNumber: z.string().min(VALIDATION.MIN_PHONE_LENGTH, { 
    message: `El número de teléfono debe tener al menos ${VALIDATION.MIN_PHONE_LENGTH} dígitos` 
  }).refine(val => /^\+?[0-9]+$/.test(val), {
    message: 'El número de teléfono solo debe contener números'
  })
});

// Ticket validation schema
const ticketSchema = z.object({
  customerName: customerSchema.shape.name,
  phoneNumber: customerSchema.shape.phoneNumber,
  totalPrice: z.number().min(0, { message: 'El precio no puede ser negativo' }),
  paymentMethod: z.enum(['cash', 'debit', 'mercadopago', 'cuenta_dni'], { 
    errorMap: () => ({ message: 'Método de pago no válido' }) 
  }),
  valetQuantity: z.number().int().min(0, { message: 'La cantidad de valets no puede ser negativa' })
});

// Feedback validation schema
const feedbackSchema = z.object({
  customerName: z.string().min(1, { message: 'El nombre es requerido' }),
  rating: z.number().int().min(1).max(5, { message: 'La calificación debe estar entre 1 y 5' }),
  comment: z.string().min(1, { message: 'El comentario es requerido' })
});

// Expense validation schema
const expenseSchema = z.object({
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  amount: z.number().positive({ message: 'El monto debe ser mayor a cero' }),
  date: z.date()
});

// Inventory item validation schema
const inventoryItemSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  quantity: z.number().int().min(0, { message: 'La cantidad no puede ser negativa' }),
  unit: z.string().optional(),
  threshold: z.number().int().min(0).optional()
});

// Generic validation function
export const validateData = <T>(schema: z.ZodSchema<T>, data: any, context?: any): { 
  isValid: boolean; 
  data?: T; 
  errors?: z.ZodError 
} => {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format error messages
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      // Log validation error
      handleValidationError(
        `Validation failed: ${formattedErrors.map(e => e.message).join(', ')}`,
        context,
        false
      );
      
      return { isValid: false, errors: error };
    }
    
    // Handle unexpected errors
    handleValidationError('Error de validación inesperado', context, true);
    return { isValid: false };
  }
};

// Export specific validation functions
export const validateCustomer = (data: any, context?: any) => 
  validateData(customerSchema, data, { ...context, entity: 'customer' });

export const validateTicket = (data: any, context?: any) => 
  validateData(ticketSchema, data, { ...context, entity: 'ticket' });

export const validateFeedback = (data: any, context?: any) => 
  validateData(feedbackSchema, data, { ...context, entity: 'feedback' });

export const validateExpense = (data: any, context?: any) => 
  validateData(expenseSchema, data, { ...context, entity: 'expense' });

export const validateInventoryItem = (data: any, context?: any) => 
  validateData(inventoryItemSchema, data, { ...context, entity: 'inventoryItem' });

// Function to validate phone numbers
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  return phoneNumber.length >= VALIDATION.MIN_PHONE_LENGTH && /^\+?[0-9]+$/.test(phoneNumber);
};

// Function to validate customer names
export const isValidCustomerName = (name: string): boolean => {
  return name.length >= VALIDATION.MIN_NAME_LENGTH;
};
