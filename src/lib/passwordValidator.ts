
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as enDictionary, translations as englishTranslations } from '@zxcvbn-ts/language-en';

// Define enum for password strength levels
export enum PasswordStrength {
  WEAK = 0,
  MEDIUM = 2,
  STRONG = 4
}

// Corrigiendo el formato del objeto de opciones para que sea compatible con el tipo OptionsType
const options = {
  translations: englishTranslations,
  dictionary: {
    ...commonDictionary,
    ...enDictionary
  }
};

zxcvbnOptions.setOptions(options);

export interface PasswordValidationResult {
  score: number;
  strength: PasswordStrength;
  isValid: boolean;
  errors: string[];
}

// Get color based on password strength
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.STRONG:
      return '#10b981'; // Green
    case PasswordStrength.MEDIUM:
      return '#f59e0b'; // Amber
    case PasswordStrength.WEAK:
    default:
      return '#ef4444'; // Red
  }
};

export const validatePassword = (password: string): PasswordValidationResult => {
  const result = zxcvbn(password || '');

  // Convert to our custom format
  const strength = result.score >= 3
    ? PasswordStrength.STRONG
    : (result.score >= 2 ? PasswordStrength.MEDIUM : PasswordStrength.WEAK);

  // Extract warnings as errors
  const errors = result.feedback.warning
    ? [result.feedback.warning]
    : result.feedback.suggestions.length > 0
      ? [result.feedback.suggestions[0]]
      : ['Password is too weak'];

  return {
    score: result.score,
    strength,
    isValid: result.score >= 2, // Consider valid if medium strength or better
    errors
  };
};
