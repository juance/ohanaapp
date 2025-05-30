
import { mockSupabaseClient } from '../../../mocks/supabase';
import { storeCustomer, getCustomerByPhone } from '@/lib/data/customer/customerStorageService';

// Mock del cliente Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

// Mock del toast
jest.mock('@/lib/toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('CustomerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar respuestas mock por defecto
    mockSupabaseClient.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'customer-123', name: 'María González', phone: '987654321' },
            error: null,
          }),
        }),
      }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'customer-123', name: 'María González', phone: '987654321' },
            error: null,
          }),
        }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    });
  });

  describe('storeCustomer', () => {
    test('should create a customer successfully', async () => {
      const customerData = {
        name: 'María González',
        phoneNumber: '987654321',
      };

      const result = await storeCustomer(customerData);

      expect(result).toBeDefined();
      expect(result?.name).toBe('María González');
      expect(result?.phoneNumber).toBe('987654321');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('customers');
    });

    test('should handle creation error', async () => {
      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const customerData = {
        name: 'María González',
        phoneNumber: '987654321',
      };

      const result = await storeCustomer(customerData);
      expect(result).toBeNull();
    });
  });

  describe('getCustomerByPhone', () => {
    test('should retrieve customer by phone number', async () => {
      const result = await getCustomerByPhone('987654321');

      expect(result).toBeDefined();
      expect(result?.phoneNumber).toBe('987654321');
      expect(result?.name).toBe('María González');
    });

    test('should handle customer not found', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      });

      const result = await getCustomerByPhone('000000000');
      expect(result).toBeNull();
    });
  });
});
