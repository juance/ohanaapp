
import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

// Funciones de utilidad de fecha para testing
const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
};

const parseDate = (dateString: string) => {
  return parseISO(dateString);
};

const isValidDate = (date: any) => {
  return date instanceof Date && isValid(date);
};

describe('Date Utils', () => {
  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toBe('15/01/2024');
    });

    test('should format date with custom format', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date, 'dd-MM-yyyy HH:mm');
      expect(formatted).toMatch(/15-01-2024 \d{2}:\d{2}/);
    });

    test('should handle string dates', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const formatted = formatDate(dateString);
      expect(formatted).toBe('15/01/2024');
    });
  });

  describe('parseDate', () => {
    test('should parse ISO date string', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const parsed = parseDate(dateString);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
    });

    test('should handle invalid date string', () => {
      const invalidDate = parseDate('invalid-date');
      expect(isValid(invalidDate)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    test('should validate correct dates', () => {
      const validDate = new Date('2024-01-15');
      expect(isValidDate(validDate)).toBe(true);
    });

    test('should reject invalid dates', () => {
      const invalidDate = new Date('invalid');
      expect(isValidDate(invalidDate)).toBe(false);
    });

    test('should reject non-date values', () => {
      expect(isValidDate('2024-01-15')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });
});
