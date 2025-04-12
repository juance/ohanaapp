
import { syncAllData } from './sync/comprehensiveSync';
import { syncClientData } from './sync/clientsSync';
import { syncFeedbackData } from './sync/feedbackSync';
import { syncMetricsData } from './sync/metricsSync';
import { getSyncStatus } from './sync/syncStatusService';

// Add resetLocalData function
export const resetLocalData = (): void => {
  localStorage.removeItem('clients');
  localStorage.removeItem('customer_feedback');
  localStorage.removeItem('tickets');
  localStorage.removeItem('expenses');
  console.log('Local data has been reset');
};

// Add syncOfflineData alias for backward compatibility
export const syncOfflineData = syncAllData;

export {
  syncAllData,
  syncClientData,
  syncFeedbackData,
  syncMetricsData,
  getSyncStatus
};
