
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as enDictionary, translations as englishTranslations } from '@zxcvbn-ts/language-en';

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
<<<<<<< HEAD
=======
  /* Comentado para usar las traducciones predefinidas
  translations: {
    warnings: {
      straightRow: 'Straight rows of keys are easy to guess',
      keyPattern: 'Short keyboard patterns are easy to guess',
      simpleRepeat: 'Repeated characters like "aaa" are easy to guess',
      extendedRepeat: 'Repeated character patterns like "abcabc" are easy to guess',
      sequences: 'Common character sequences like "abc" are easy to guess',
      recentYears: 'Recent years are easy to guess',
      dates: 'Dates are easy to guess',
      topTen: 'This is a top-10 common password',
      topHundred: 'This is a top-100 common password',
      common: 'This is a commonly used password',
      similarToCommon: 'This is similar to a commonly used password',
      wordByItself: 'Single words are easy to guess',
      namesByThemselves: 'Single names or surnames are easy to guess',
      commonNames: 'Common names and surnames are easy to guess',
      userInputs: 'There should not be any personal or page related data',
      pwned: 'This password has been exposed in data breaches'
    },
    suggestions: {
      l33t: "Avoid predictable letter substitutions like '@' for 'a'",
      reverseWords: "Avoid reversed spellings of common words",
      allUppercase: "Use some lowercase letters as well",
      capitalization: "Use more than just the first letter as uppercase",
      dates: "Avoid dates and years that are associated with you",
      recentYears: "Avoid recent years",
      associatedYears: "Avoid years that are associated with you",
      sequences: "Avoid common character sequences",
      repeated: "Avoid repeated words and characters",
      longerKeyboardPattern: "Use longer keyboard patterns and change typing direction",
      anotherWord: "Add more words that are less common",
      useWords: "Use multiple words, but avoid common phrases",
      noNeed: "You can create strong passwords without using symbols, numbers, or uppercase letters",
      pwned: "If you use this password elsewhere, you should change it"
    },
    timeEstimation: {
      instantly: 'Less than a second',
      seconds: '{base} seconds',
      minute: 'About a minute',
      minutes: '{base} minutes',
      hour: 'About an hour',
      hours: '{base} hours',
      day: 'About a day',
      days: '{base} days',
      month: 'About a month',
      months: '{base} months',
      year: 'About a year',
      years: '{base} years',
      centuries: 'Centuries'
    },
  */
  },
>>>>>>> 24048d5fd8de11d2cf211a71c60efaf91f2c21c2
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
