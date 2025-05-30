
// Funciones de utilidad de precios para testing
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);
};

const calculateTax = (amount: number, taxRate: number = 0.21): number => {
  return amount * taxRate;
};

const applyDiscount = (amount: number, discountPercentage: number): number => {
  return amount - (amount * discountPercentage / 100);
};

const calculateTotal = (subtotal: number, tax: number = 0, discount: number = 0): number => {
  return subtotal + tax - discount;
};

describe('Price Utils', () => {
  describe('formatPrice', () => {
    test('should format price in Argentine pesos', () => {
      const formatted = formatPrice(1500);
      expect(formatted).toMatch(/\$.*1\.500/);
    });

    test('should handle decimal prices', () => {
      const formatted = formatPrice(1250.50);
      expect(formatted).toMatch(/\$.*1\.250,50/);
    });

    test('should handle zero price', () => {
      const formatted = formatPrice(0);
      expect(formatted).toMatch(/\$.*0/);
    });
  });

  describe('calculateTax', () => {
    test('should calculate 21% tax by default', () => {
      const tax = calculateTax(1000);
      expect(tax).toBe(210);
    });

    test('should calculate custom tax rate', () => {
      const tax = calculateTax(1000, 0.10);
      expect(tax).toBe(100);
    });

    test('should handle zero amount', () => {
      const tax = calculateTax(0);
      expect(tax).toBe(0);
    });
  });

  describe('applyDiscount', () => {
    test('should apply percentage discount', () => {
      const discounted = applyDiscount(1000, 10);
      expect(discounted).toBe(900);
    });

    test('should handle 100% discount', () => {
      const discounted = applyDiscount(1000, 100);
      expect(discounted).toBe(0);
    });

    test('should handle zero discount', () => {
      const discounted = applyDiscount(1000, 0);
      expect(discounted).toBe(1000);
    });
  });

  describe('calculateTotal', () => {
    test('should calculate total with tax and discount', () => {
      const total = calculateTotal(1000, 210, 100);
      expect(total).toBe(1110);
    });

    test('should calculate total with only subtotal', () => {
      const total = calculateTotal(1000);
      expect(total).toBe(1000);
    });

    test('should handle negative totals', () => {
      const total = calculateTotal(100, 0, 150);
      expect(total).toBe(-50);
    });
  });
});
