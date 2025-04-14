
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncTickets } from '../data/sync/ticketsSync';
import { syncClients } from '../data/sync/clientsSync';
import { syncFeedback } from '../data/sync/feedbackSync';
import { syncComprehensive } from '../data/sync/comprehensiveSync';

// Mock the synchronization functions
vi.mock('../data/sync/ticketsSync', () => ({
  syncTickets: vi.fn()
}));

vi.mock('../data/sync/clientsSync', () => ({
  syncClients: vi.fn()
}));

vi.mock('../data/sync/feedbackSync', () => ({
  syncFeedback: vi.fn()
}));

vi.mock('../data/sync/syncStatusService', () => ({
  updateSyncStatus: vi.fn().mockResolvedValue(true)
}));

describe('Sync Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should synchronize tickets', async () => {
    (syncTickets as any).mockResolvedValue(5);
    
    const result = await syncTickets();
    
    expect(result).toBe(5);
    expect(syncTickets).toHaveBeenCalledTimes(1);
  });

  it('should synchronize clients', async () => {
    (syncClients as any).mockResolvedValue(3);
    
    const result = await syncClients();
    
    expect(result).toBe(3);
    expect(syncClients).toHaveBeenCalledTimes(1);
  });

  it('should synchronize feedback', async () => {
    (syncFeedback as any).mockResolvedValue(2);
    
    const result = await syncFeedback();
    
    expect(result).toBe(2);
    expect(syncFeedback).toHaveBeenCalledTimes(1);
  });

  it('should perform comprehensive sync correctly', async () => {
    (syncTickets as any).mockResolvedValue(5);
    (syncClients as any).mockResolvedValue(3);
    (syncFeedback as any).mockResolvedValue(2);
    
    const result = await syncComprehensive();
    
    expect(result).toEqual({
      tickets: 5,
      clients: 3,
      feedback: 2,
      success: true
    });
    
    expect(syncTickets).toHaveBeenCalledTimes(1);
    expect(syncClients).toHaveBeenCalledTimes(1);
    expect(syncFeedback).toHaveBeenCalledTimes(1);
  });
});
