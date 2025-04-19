import { zxcvbn, ZxcvbnOptions } from '@zxcvbn-ts/core';
import { dictionary as commonDictionary } from '@zxcvbn-ts/language-common';
import { dictionary as enDictionary } from '@zxcvbn-ts/language-en';
// Remove Spanish language import that's causing issues

const options = {
  translations: {
    // Simplified translations without Spanish
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
  },
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
    // Remove Spanish dictionary
  }
};

ZxcvbnOptions.setOptions(options);

export const validatePassword = (password: string) => {
  const result = zxcvbn(password || '');
  return result;
};
