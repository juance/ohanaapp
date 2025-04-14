
/**
 * Ticket Workflow Tests
 *
 * These tests verify that tickets follow the correct workflow and
 * appear in the appropriate sections based on their status.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createUnifiedTicket } from '@/lib/ticket/ticketUnifiedService';
import { getPendingTickets } from '@/lib/ticket/ticketPendingService';
import { getPickupTickets } from '@/lib/ticket/ticketPickupService';
import { getDeliveredTickets } from '@/lib/ticket/ticketDeliveryService';
import {
  markTicketAsProcessing,
  markTicketAsReady,
  markTicketAsDelivered
} from '@/lib/ticket/ticketStatusTransitionService';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  // In-memory database for testing
  const mockDb = {
    tickets: [
      {
        id: '1',
        ticket_number: '00000001',
        status: TICKET_STATUS.PENDING,
        is_canceled: false,
        is_paid: false,
        customer_id: 'customer-1',
        customers: { name: 'Test Customer', phone: '1234567890' }
      }
    ],
    customers: [
      {
        id: 'customer-1',
        name: 'Test Customer',
        phone: '1234567890',
        loyalty_points: 0,
        valets_count: 0,
        free_valets: 0
      }
    ],
    ticket_services: [],
    ticket_options: []
  };

  return {
    supabase: {
      from: vi.fn().mockImplementation((table) => {
        return {
          select: vi.fn().mockImplementation((query) => {
            return {
              eq: vi.fn().mockImplementation((field, value) => {
                return {
                  eq: vi.fn().mockImplementation((field2, value2) => {
                    const filteredData = mockDb[table].filter(
                      item => item[field] === value && item[field2] === value2
                    );
                    return {
                      single: vi.fn().mockResolvedValue({
                        data: filteredData.length > 0 ? filteredData[0] : null,
                        error: null
                      }),
                      limit: vi.fn().mockResolvedValue({
                        data: filteredData,
                        error: null
                      })
                    };
                  }),
                  single: vi.fn().mockResolvedValue({
                    data: mockDb[table].find(item => item[field] === value),
                    error: null
                  }),
                  limit: vi.fn().mockResolvedValue({
                    data: mockDb[table].filter(item => item[field] === value),
                    error: null
                  }),
                  order: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue({
                      data: mockDb[table].filter(item => item[field] === value),
                      error: null
                    })
                  }),
                  in: vi.fn().mockImplementation((field2, values) => {
                    return {
                      eq: vi.fn().mockImplementation((field3, value3) => {
                        const filteredData = mockDb[table].filter(
                          item => values.includes(item[field2]) && item[field3] === value3
                        );
                        return {
                          data: filteredData,
                          error: null
                        };
                      })
                    };
                  })
                };
              }),
              in: vi.fn().mockImplementation((field, values) => {
                return {
                  eq: vi.fn().mockResolvedValue({
                    data: mockDb[table].filter(
                      item => values.includes(item[field]) && item.is_canceled === false
                    ),
                    error: null
                  })
                };
              }),
              limit: vi.fn().mockResolvedValue({
                data: mockDb[table].slice(0, 1),
                error: null
              })
            };
          }),
          insert: vi.fn().mockImplementation((data) => {
            if (Array.isArray(data)) {
              mockDb[table].push(...data);
            } else {
              mockDb[table].push(data);
            }
            return {
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: Array.isArray(data) ? data[0] : data,
                  error: null
                })
              })
            };
          }),
          update: vi.fn().mockImplementation((updates) => {
            return {
              eq: vi.fn().mockImplementation((field, value) => {
                const index = mockDb[table].findIndex(item => item[field] === value);
                if (index !== -1) {
                  mockDb[table][index] = { ...mockDb[table][index], ...updates };
                }
                return { data: null, error: null };
              })
            };
          })
        };
      },
      rpc: vi.fn().mockResolvedValue({ data: '00000002', error: null })
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

vi.mock('@/lib/data/customer/customerStorageService', () => ({
  updateCustomerLastVisit: vi.fn().mockResolvedValue(true)
}));

describe('Ticket Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create a ticket with ready status', async () => {
    const result = await createUnifiedTicket({
      customerName: 'New Customer',
      phoneNumber: '9999999999',
      totalPrice: 150,
      paymentMethod: 'cash'
    });

    expect(result.success).toBe(true);
    expect(result.ticketId).toBeDefined();
    expect(result.ticketNumber).toBe('00000002');
  });

  it('should transition a ticket through all states correctly', async () => {
    // 1. Create a ticket (it will be in READY state)
    const createResult = await createUnifiedTicket({
      customerName: 'Workflow Test',
      phoneNumber: '8888888888',
      totalPrice: 200,
      paymentMethod: 'cash'
    });

    expect(createResult.success).toBe(true);
    expect(createResult.ticketId).toBeDefined();

    if (!createResult.ticketId) return; // TypeScript guard

    // 2. Verify it appears in pending tickets but not in pickup tickets
    const pendingTickets = await getPendingTickets();
    const pickupTickets = await getPickupTickets();

    const pendingIds = pendingTickets.map(t => t.id);
    const pickupIds = pickupTickets.map(t => t.id);

    expect(pendingIds).toContain(createResult.ticketId);
    expect(pickupIds).not.toContain(createResult.ticketId);

    // 3. Mark as processing
    const processingSuccess = await markTicketAsProcessing(createResult.ticketId);
    expect(processingSuccess).toBe(true);

    // 4. Mark as ready
    const readySuccess = await markTicketAsReady(createResult.ticketId);
    expect(readySuccess).toBe(true);

    // 5. Verify it now appears in pickup tickets
    const updatedPickupTickets = await getPickupTickets();
    const updatedPickupIds = updatedPickupTickets.map(t => t.id);

    expect(updatedPickupIds).toContain(createResult.ticketId);

    // 6. Mark as delivered
    const deliveredSuccess = await markTicketAsDelivered(createResult.ticketId);
    expect(deliveredSuccess).toBe(true);

    // 7. Verify it no longer appears in pending or pickup tickets, but in delivered tickets
    const finalPendingTickets = await getPendingTickets();
    const finalPickupTickets = await getPickupTickets();
    const deliveredTickets = await getDeliveredTickets();

    const finalPendingIds = finalPendingTickets.map(t => t.id);
    const finalPickupIds = finalPickupTickets.map(t => t.id);
    const deliveredIds = deliveredTickets.map(t => t.id);

    expect(finalPendingIds).not.toContain(createResult.ticketId);
    expect(finalPickupIds).not.toContain(createResult.ticketId);
    expect(deliveredIds).toContain(createResult.ticketId);
  });
});
