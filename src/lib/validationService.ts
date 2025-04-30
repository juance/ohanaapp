
import { logError, handleValidationError } from './errorHandlingService';
import { ErrorLevel, ErrorContext } from './types';

/**
 * Validate string field is not empty
 */
export const validateRequired = (value: string | undefined, fieldName: string): boolean => {
  if (!value || value.trim() === '') {
    handleValidationError(`${fieldName} is required`, fieldName);
    return false;
  }
  return true;
};

/**
 * Validate field meets minimum length
 */
export const validateMinLength = (value: string | undefined, minLength: number, fieldName: string): boolean => {
  if (!value || value.length < minLength) {
    handleValidationError(`${fieldName} must be at least ${minLength} characters`, fieldName, value);
    return false;
  }
  return true;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    handleValidationError('Invalid email format', 'email', email);
    return false;
  }
  return true;
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone: string): boolean => {
  // Simple regex that accepts various phone formats
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  if (!phoneRegex.test(phone)) {
    handleValidationError('Invalid phone number format', 'phone', phone);
    return false;
  }
  return true;
};

/**
 * Validate numeric value range
 */
export const validateNumericRange = (value: number, min: number, max: number, fieldName: string): boolean => {
  if (value < min || value > max) {
    handleValidationError(`${fieldName} must be between ${min} and ${max}`, fieldName, value);
    return false;
  }
  return true;
};

/**
 * Validate form data object
 */
export const validateFormData = (formData: Record<string, any>, validationRules: Record<string, Function[]>): boolean => {
  let isValid = true;
  
  Object.entries(validationRules).forEach(([field, rules]) => {
    const value = formData[field];
    
    rules.forEach(rule => {
      if (!rule(value)) {
        isValid = false;
      }
    });
  });
  
  return isValid;
};
