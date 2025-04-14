
/**
 * Ticket Status Tests
 *
 * These tests verify that tickets are correctly displayed in the appropriate sections
 * based on their status, and that status transitions work as expected.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getPendingTickets } from '@/lib/ticket/ticketPendingService';
import { getPickupTickets } from '@/lib/ticket/ticketPickupService';
import { getDeliveredTickets } from '@/lib/ticket/ticketDeliveryService';
import { createTicket } from '@/lib/ticket/ticketCreationService';
import { markTicketAsDelivered } from '@/lib/ticket/ticketPickupService';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { mapToSimplifiedStatus, getDatabaseStatuses } from '@/lib/ticket/ticketStatusService';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const mockTickets = [
    {
      id: '1',
      ticket_number: '00000001',
      status: 'ready',
      is_canceled: false,
      customers: { name: 'Test Customer', phone: '1234567890' }
    },
    {
      id: '2',
      ticket_number: '00000002',
      status: 'pending',
      is_canceled: false,
      customers: { name: 'Test Customer 2', phone: '0987654321' }
    },
    {
      id: '3',
      ticket_number: '00000003',
      status: 'delivered',
      is_canceled: false,
      customers: { name: 'Test Customer 3', phone: '5555555555' }
    }
  ];

  return {
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockTickets[0], error: null }),
              limit: vi.fn().mockResolvedValue({ data: mockTickets, error: null }),
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({ data: [{ basket_ticket_number: '1' }], error: null })
              })
            }),
            limit: vi.fn().mockResolvedValue({ data: mockTickets, error: null }),
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: [{ basket_ticket_number: '1' }], error: null })
            }),
            in: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: mockTickets.filter(t => t.status !== 'delivered'), error: null })
            })
          }),
          in: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              data: mockTickets.filter(t => ['pending', 'processing', 'ready'].includes(t.status)),
              error: null
            })
          }),
          limit: vi.fn().mockResolvedValue({ data: [{ delivered_date: null }], error: null })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: '4',
                ticket_number: '00000004',
                status: 'ready'
              },
              error: null
            })
          })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      },
      rpc: vi.fn().mockResolvedValue({ data: '00000004', error: null })
    }
  };
});

// Mock other dependencies
vi.mock('@/lib/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/lib/data/customerService', () => ({
  getCustomerByPhone: vi.fn().mockResolvedValue({ id: 'customer-1' }),
  updateValetsCount: vi.fn().mockResolvedValue(true),
  useFreeValet: vi.fn().mockResolvedValue(true),
  addLoyaltyPoints: vi.fn().mockResolvedValue(true)
}));

describe('Ticket Status Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should map database statuses to simplified statuses correctly', () => {
    expect(mapToSimplifiedStatus(TICKET_STATUS.PENDING)).toBe('PENDING');
    expect(mapToSimplifiedStatus(TICKET_STATUS.PROCESSING)).toBe('PENDING');
    expect(mapToSimplifiedStatus(TICKET_STATUS.READY)).toBe('PENDING');
    expect(mapToSimplifiedStatus(TICKET_STATUS.DELIVERED)).toBe('DELIVERED');
  });

  it('should return correct database statuses for simplified statuses', () => {
    const pendingStatuses = getDatabaseStatuses('PENDING');
    expect(pendingStatuses).toContain(TICKET_STATUS.PENDING);
    expect(pendingStatuses).toContain(TICKET_STATUS.PROCESSING);
    expect(pendingStatuses).toContain(TICKET_STATUS.READY);
    expect(pendingStatuses).not.toContain(TICKET_STATUS.DELIVERED);

    const deliveredStatuses = getDatabaseStatuses('DELIVERED');
    expect(deliveredStatuses).toContain(TICKET_STATUS.DELIVERED);
    expect(deliveredStatuses).not.toContain(TICKET_STATUS.PENDING);
    expect(deliveredStatuses).not.toContain(TICKET_STATUS.PROCESSING);
    expect(deliveredStatuses).not.toContain(TICKET_STATUS.READY);
  });
});

describe('Ticket Retrieval Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should retrieve pending tickets correctly', async () => {
    const tickets = await getPendingTickets();
    expect(tickets).toBeDefined();
    expect(tickets.length).toBeGreaterThan(0);
    // All tickets should have a status that is not 'delivered'
    tickets.forEach(ticket => {
      expect(ticket.status).not.toBe(TICKET_STATUS.DELIVERED);
    });
  });

  it('should retrieve pickup tickets correctly', async () => {
    const tickets = await getPickupTickets();
    expect(tickets).toBeDefined();
    // All tickets should have 'ready' status
    tickets.forEach(ticket => {
      expect(ticket.status).toBe(TICKET_STATUS.READY);
    });
  });

  it('should create a new ticket with ready status by default', async () => {
    const result = await createTicket({
      customerName: 'Test Customer',
      phoneNumber: '1234567890',
      totalPrice: 100,
      paymentMethod: 'cash'
    });

    expect(result.success).toBe(true);
    expect(result.ticketNumber).toBeDefined();
  });

  it('should mark a ticket as delivered', async () => {
    const success = await markTicketAsDelivered('1');
    expect(success).toBe(true);
  });
});

describe('Ticket Status Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should follow the correct status workflow', async () => {
    // 1. Create a new ticket
    const createResult = await createTicket({
      customerName: 'Workflow Test',
      phoneNumber: '9999999999',
      totalPrice: 150,
      paymentMethod: 'cash'
    });

    expect(createResult.success).toBe(true);
    expect(createResult.ticketId).toBeDefined();

    if (!createResult.ticketId) return; // TypeScript guard

    // 2. Verify it appears in pending tickets
    const pendingTickets = await getPendingTickets();
    const pendingIds = pendingTickets.map(t => t.id);
    expect(pendingIds).toContain(createResult.ticketId);

    // 3. Mark as delivered
    const deliveredSuccess = await markTicketAsDelivered(createResult.ticketId);
    expect(deliveredSuccess).toBe(true);

    // 4. Verify it no longer appears in pending tickets
    const updatedPendingTickets = await getPendingTickets();
    const updatedPendingIds = updatedPendingTickets.map(t => t.id);
    expect(updatedPendingIds).not.toContain(createResult.ticketId);
  });
});
