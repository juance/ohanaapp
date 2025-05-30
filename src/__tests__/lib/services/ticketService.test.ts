
import { mockSupabaseClient } from '../../mocks/supabase';
import { createTicket, getFullTicket, cancelTicket } from '@/lib/ticket/ticketServiceCore';

// Mock del cliente Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

// Mock del servicio de números de ticket
jest.mock('@/lib/dataService', () => ({
  getNextTicketNumber: jest.fn().mockResolvedValue('T-001'),
}));

// Mock del toast
jest.mock('@/lib/toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('TicketService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Configurar respuestas mock por defecto
    mockSupabaseClient.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'ticket-123' },
            error: null,
          }),
        }),
      }),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'ticket-123',
            ticket_number: 'T-001',
            total: 100,
            status: 'pending',
            customers: { id: 'customer-1', name: 'Juan Pérez', phone: '123456789' },
          },
          error: null,
        }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    });
  });

  describe('createTicket', () => {
    test('should create a ticket successfully', async () => {
      const ticketData = {
        clientName: 'Juan Pérez',
        phoneNumber: '123456789',
        totalPrice: 100,
        paymentMethod: 'cash',
        isPaid: false,
        valetQuantity: 2,
        customerId: 'customer-1',
      };

      const result = await createTicket(ticketData);

      expect(result).toBe('ticket-123');
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('tickets');
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

      const ticketData = {
        clientName: 'Juan Pérez',
        phoneNumber: '123456789',
        totalPrice: 100,
        paymentMethod: 'cash',
        isPaid: false,
        valetQuantity: 0,
        customerId: 'customer-1',
      };

      const result = await createTicket(ticketData);
      expect(result).toBeNull();
    });
  });

  describe('getFullTicket', () => {
    test('should retrieve a complete ticket', async () => {
      const result = await getFullTicket('ticket-123');

      expect(result).toBeDefined();
      expect(result?.id).toBe('ticket-123');
      expect(result?.ticketNumber).toBe('T-001');
      expect(result?.clientName).toBe('Juan Pérez');
    });

    test('should handle ticket not found', async () => {
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

      const result = await getFullTicket('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('cancelTicket', () => {
    test('should cancel a ticket successfully', async () => {
      const result = await cancelTicket('ticket-123', 'Customer request');

      expect(result).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('tickets');
    });

    test('should handle cancel error', async () => {
      mockSupabaseClient.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: { message: 'Update failed' },
          }),
        }),
      });

      const result = await cancelTicket('ticket-123', 'Customer request');
      expect(result).toBe(false);
    });
  });
});
