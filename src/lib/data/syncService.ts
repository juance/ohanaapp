
import { syncClientData } from './sync/clientsSync';
import { syncFeedbackData } from './sync/feedbackSync';
import { syncMetricsData } from './sync/metricsSync';

/**
 * Sync all offline data to Supabase
 */
export const syncOfflineData = async (): Promise<boolean> => {
  try {
    // Sync clients data
    await syncClientData();

    // Sync feedback data
    await syncFeedbackData();

    // Sync metrics data
    await syncMetricsData();

    console.log('All offline data synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing offline data:', error);
    return false;
  }
};

/**
 * Reset local data (for debugging/development)
 */
export const resetLocalData = (): boolean => {
  try {
    // Clear localStorage
    localStorage.clear();
    console.log('Local data reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting local data:', error);
    return false;
  }
};
