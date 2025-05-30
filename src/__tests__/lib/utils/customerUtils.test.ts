
// Mock de utilidades de clientes
const formatPhoneNumber = (phone: string): string => {
  // Remover espacios y caracteres especiales
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear como (XXX) XXX-XXXX si tiene 10 dígitos
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 8 && cleaned.length <= 15;
};

const generateCustomerId = (): string => {
  return `customer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

describe('Customer Utils', () => {
  describe('formatPhoneNumber', () => {
    test('should format 10-digit phone number', () => {
      const formatted = formatPhoneNumber('1234567890');
      expect(formatted).toBe('(123) 456-7890');
    });

    test('should return original if not 10 digits', () => {
      const formatted = formatPhoneNumber('123-456');
      expect(formatted).toBe('123-456');
    });

    test('should handle phone with existing formatting', () => {
      const formatted = formatPhoneNumber('(123) 456-7890');
      expect(formatted).toBe('(123) 456-7890');
    });
  });

  describe('validatePhoneNumber', () => {
    test('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('12345678')).toBe(true);
      expect(validatePhoneNumber('1234567890')).toBe(true);
      expect(validatePhoneNumber('+541234567890')).toBe(true);
    });

    test('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('12345678901234567')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
    });
  });

  describe('generateCustomerId', () => {
    test('should generate unique customer IDs', () => {
      const id1 = generateCustomerId();
      const id2 = generateCustomerId();
      
      expect(id1).toMatch(/^customer-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^customer-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });
});
