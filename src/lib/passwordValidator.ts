
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import * as zxcvbnEsPackage from '@zxcvbn-ts/language-es';

// Initialize zxcvbn with language packs
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
    ...zxcvbnEsPackage.dictionary,
  },
};
zxcvbnOptions.setOptions(options);

// Password strength enum
export enum PasswordStrength {
  WEAK = 0,
  MEDIUM = 1,
  STRONG = 2
}

// Password validation interface
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: PasswordStrength;
  score: number; // zxcvbn score (0-4)
}

/**
 * Validate a password
 * @param password Password to validate
 * @returns Validation result
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  
  // Check length
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  // Check for digits
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  // Use zxcvbn for additional validation
  const result = zxcvbn(password);
  
  // Determine strength
  let strength: PasswordStrength;
  switch (result.score) {
    case 0:
    case 1:
      strength = PasswordStrength.WEAK;
      break;
    case 2:
    case 3:
      strength = PasswordStrength.MEDIUM;
      break;
    case 4:
      strength = PasswordStrength.STRONG;
      break;
    default:
      strength = PasswordStrength.WEAK;
  }
  
  return {
    isValid: errors.length === 0 && result.score >= 2,
    errors,
    strength,
    score: result.score
  };
};

/**
 * Get a color for a password strength
 * @param strength Password strength
 * @returns Hex color
 */
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.WEAK:
      return '#f44336'; // Red
    case PasswordStrength.MEDIUM:
      return '#ff9800'; // Orange
    case PasswordStrength.STRONG:
      return '#4caf50'; // Green
    default:
      return '#f44336'; // Red
  }
};
