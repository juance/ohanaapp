
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as enDictionary } from '@zxcvbn-ts/language-en';

// Define enum for password strength levels
export enum PasswordStrength {
  WEAK = 0,
  MEDIUM = 2,
  STRONG = 4
}

// Importar las traducciones predefinidas en lugar de definirlas manualmente
import { translations as englishTranslations } from '@zxcvbn-ts/language-en';

const options = {
  translations: englishTranslations,
  graphs: {
    qwerty: {
      adjacencyGraph: {
        'q': 'wa2wsxzaq',
        'w': 'e3edcswq1qaz',
        'e': 'r4rfvde3wq2wsd',
        'r': 't5tgbfr4e3dwf',
        't': 'y6yhnvgt5re4fg',
        'y': 'u7ujmnhy6tr5gh',
        'u': 'i8ik,mjuy7yt6hj',
        'i': 'o9ol<.ki8yu7jk',
        'o': 'p0op/>li9i8kl',
        'p': '-[pl?;o0ui',
        'a': 'qwsxza',
        's': 'wedcvfraswqaz',
        'd': 'erfbgtcdsewsx',
        'f': 'rtgyhnbvfdecr',
        'g': 'tyhujmngfvtrf',
        'h': 'yujik,nhgtgyb',
        'j': 'uikol.mhyujnv',
        'k': 'iolp/>mjkiuhb',
        'l': 'op[?+<lkijo',
        'z': 'asxzaq',
        'x': 'sdczaswec',
        'c': 'dfxzsderfv',
        'v': 'fgbvcrtby',
        'b': 'ghnvtyujn',
        'n': 'hjmbgtuikm',
        'm': 'jknbmhyilo',
        ',': 'klm,juiop',
        '.': 'l,kiop',
        '/': 'pl<.op',
        '-': 'p0[pl',
        '[': 'p-[ol',
        ']': 'p[];\'',
        '\'': 'p[];\''
      }
    }
  },
  dictionary: {
    ...commonDictionary,
    ...enDictionary,
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
