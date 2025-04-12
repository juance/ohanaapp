import { syncAllData } from '../data/sync/comprehensiveSync';
import { syncClientData } from '../data/sync/clientsSync';
import { syncFeedbackData } from '../data/sync/feedbackSync';
import { syncMetricsData } from '../data/sync/metricsSync';

// Mock dependencies
jest.mock('../data/sync/clientsSync', () => ({
  syncClientData: jest.fn().mockResolvedValue(true)
}));

jest.mock('../data/sync/feedbackSync', () => ({
  syncFeedbackData: jest.fn().mockResolvedValue(true)
}));

jest.mock('../data/sync/metricsSync', () => ({
  syncMetricsData: jest.fn().mockResolvedValue(true)
}));

describe('Sync Service', () => {
  it('should sync all data successfully', async () => {
    const result = await syncAllData();
    expect(result).toBe(true);
    expect(syncClientData).toHaveBeenCalled();
    expect(syncFeedbackData).toHaveBeenCalled();
    expect(syncMetricsData).toHaveBeenCalled();
  });
});
