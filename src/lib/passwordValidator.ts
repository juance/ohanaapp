
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core';
import { dictionary } from '@zxcvbn-ts/language-common';
import { translations as enTranslations } from '@zxcvbn-ts/language-en';

// Initialize zxcvbn with custom options
const options = {
  dictionary: {
    ...dictionary,
    userInputs: ['ohana', 'admin', 'laundry', 'lavanderia', 'tintoreria'],
  },
  translations: enTranslations,
};

zxcvbn.setOptions(options);

export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  isStrong: boolean;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  try {
    // Get zxcvbn result
    const result: ZxcvbnResult = zxcvbn(password);

    // Custom validation rules
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // All rules must pass
    const isValid = hasMinLength && 
                    hasUppercase && 
                    hasLowercase && 
                    hasNumber && 
                    hasSpecial;

    // Password is strong if it's valid and zxcvbn score is >= 3
    const isStrong = isValid && result.score >= 3;

    // Custom feedback based on which rules failed
    let customSuggestions = [];
    if (!hasMinLength) customSuggestions.push('La contraseña debe tener al menos 8 caracteres.');
    if (!hasUppercase) customSuggestions.push('Incluir al menos una letra mayúscula.');
    if (!hasLowercase) customSuggestions.push('Incluir al menos una letra minúscula.');
    if (!hasNumber) customSuggestions.push('Incluir al menos un número.');
    if (!hasSpecial) customSuggestions.push('Incluir al menos un carácter especial (!@#$%^&*(),.?":{}|<>).');

    // Combine our suggestions with zxcvbn's if they exist
    const allSuggestions = [
      ...customSuggestions,
      ...(result.feedback?.suggestions || [])
    ];

    return {
      isValid,
      score: result.score,
      feedback: {
        warning: result.feedback?.warning || '',
        suggestions: allSuggestions
      },
      isStrong
    };
  } catch (error) {
    console.error('Password validation error:', error);
    // Return a fallback result if zxcvbn fails
    return {
      isValid: false,
      score: 0,
      feedback: {
        warning: 'Error validando la contraseña',
        suggestions: ['Por favor, intente con otra contraseña.']
      },
      isStrong: false
    };
  }
};

// Constants for password reset
export const PASSWORD_RESET_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Format: hash$timestamp$email
export const createPasswordResetToken = (email: string): string => {
  const timestamp = Date.now().toString();
  const token = `${Math.random().toString(36).substring(2, 15)}${timestamp}${email}`;
  return `${token}$${timestamp}$${email}`;
};

export const validatePasswordResetToken = (token: string): { 
  isValid: boolean; 
  email: string | null;
} => {
  try {
    const parts = token.split('$');
    if (parts.length !== 3) {
      return { isValid: false, email: null };
    }

    const [_, timestampStr, email] = parts;
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // Check if token has expired
    if (now - timestamp > PASSWORD_RESET_TOKEN_EXPIRY) {
      return { isValid: false, email: null };
    }

    return { isValid: true, email };
  } catch (error) {
    console.error('Error validating reset token:', error);
    return { isValid: false, email: null };
  }
};
