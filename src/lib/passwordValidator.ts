/**
 * Password validation service
 * Provides functions to validate password strength and security
 */

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong'
}

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  errors: string[];
}

/**
 * Validates a password against security requirements
 * @param password The password to validate
 * @returns Validation result with strength assessment and any errors
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }
  
  // Determine password strength
  let strength = PasswordStrength.WEAK;
  
  if (errors.length === 0) {
    // All basic requirements met
    if (password.length >= 12 && 
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) && 
        /\d/.test(password) && 
        /[A-Z]/.test(password) && 
        /[a-z]/.test(password)) {
      strength = PasswordStrength.STRONG;
    } else {
      strength = PasswordStrength.MEDIUM;
    }
  }
  
  return {
    isValid: errors.length === 0,
    strength,
    errors
  };
}

/**
 * Checks if a password is commonly used or easily guessable
 * @param password The password to check
 * @returns True if the password is common, false otherwise
 */
export function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    'password', 'password123', '123456', '12345678', 'qwerty', 
    'admin', 'welcome', 'admin123', 'letmein', 'monkey', 'abc123',
    'football', 'iloveyou', '1234567', '123123', '12345', '1234',
    'baseball', 'dragon', 'sunshine', 'princess', 'superman', 'qwerty123',
    'trustno1', 'welcome123', 'login', 'admin1', 'password1', 'master',
    'hello123', 'freedom', 'whatever', 'qazwsx', 'whatever1', 'welcome1'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Gets a color for password strength visualization
 * @param strength The password strength
 * @returns A color code for the given strength
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.STRONG:
      return '#10b981'; // Green
    case PasswordStrength.MEDIUM:
      return '#f59e0b'; // Amber
    case PasswordStrength.WEAK:
      return '#ef4444'; // Red
    default:
      return '#ef4444'; // Red
  }
}
