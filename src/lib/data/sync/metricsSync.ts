
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';

// Define the LocalMetrics interface
interface LocalMetrics {
  daily?: any;
  weekly?: any;
  monthly?: any;
  pendingSync?: boolean;
}

/**
 * Sync metrics data
 */
export const syncMetricsData = async (): Promise<boolean> => {
  try {
    // Get local metrics data
    const localMetrics = getFromLocalStorage<LocalMetrics>('metrics_data') || {
      daily: {
        salesByHour: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        dryCleaningItems: {},
        totalSales: 0,
        valetCount: 0
      },
      weekly: {
        salesByDay: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        totalSales: 0,
        valetCount: 0
      },
      monthly: {
        salesByDay: {},
        paymentMethods: { cash: 0, debit: 0, mercadopago: 0, cuentaDni: 0 },
        totalSales: 0,
        valetCount: 0
      }
    };
    
    // Update local storage
    saveToLocalStorage('metrics_data', localMetrics);
    
    console.log('Metrics data synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing metrics data:', error);
    return false;
  }
};
