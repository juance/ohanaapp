
// Añadiendo validador de contraseñas para compatibilidad con UserDialog
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

// Configurar zxcvbn
const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};

zxcvbnOptions.setOptions(options);

// Niveles de fuerza de contraseña
export enum PasswordStrength {
  WEAK = 0,
  MEDIUM = 1,
  STRONG = 2
}

// Interfaz para resultado de validación de contraseña
interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  errors: string[];
}

/**
 * Valida la fortaleza de una contraseña
 * @param password Contraseña a validar
 * @returns Resultado de la validación
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const result: PasswordValidationResult = {
    isValid: true,
    strength: PasswordStrength.WEAK,
    errors: []
  };

  if (!password) {
    result.isValid = false;
    result.errors.push('La contraseña es obligatoria');
    return result;
  }

  if (password.length < 8) {
    result.isValid = false;
    result.errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  // Validar con zxcvbn
  const zxcvbnResult = zxcvbn(password);

  // Mapear el score de zxcvbn (0-4) a nuestros niveles de fortaleza
  if (zxcvbnResult.score <= 1) {
    result.strength = PasswordStrength.WEAK;
    if (result.isValid) { // Solo agregar este mensaje si no hay errores más específicos
      result.isValid = false;
      result.errors.push('La contraseña es demasiado débil');
    }
  } else if (zxcvbnResult.score <= 3) {
    result.strength = PasswordStrength.MEDIUM;
  } else {
    result.strength = PasswordStrength.STRONG;
  }

  return result;
};

/**
 * Devuelve el color correspondiente al nivel de fortaleza
 * @param strength Nivel de fortaleza de la contraseña
 * @returns Color en formato hexadecimal o CSS
 */
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.STRONG:
      return '#10b981'; // verde
    case PasswordStrength.MEDIUM:
      return '#f59e0b'; // amarillo
    case PasswordStrength.WEAK:
    default:
      return '#ef4444'; // rojo
  }
};
