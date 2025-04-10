
import { toast } from '@/lib/toast';
import { syncOfflineData } from '../syncService';
import { syncMetricsData } from './metricsSync';
import { syncClientsData } from './clientsSync';
import { syncTicketAnalysis } from './analysisSync';
import { syncFeedbackData } from './feedbackSync';
import { getSyncStatus } from './syncStatusService';

// Alias the syncMetricsData function to syncDashboardMetrics for backwards compatibility
const syncDashboardMetrics = syncMetricsData;

/**
 * Synchronize all application data between local storage and Supabase
 */
export const syncAllData = async (): Promise<boolean> => {
  try {
    // Display toast to inform the user
    toast({
      title: "Sincronización",
      description: "Iniciando sincronización completa de datos...",
    });

    // 1. First sync any pending offline data (tickets, expenses)
    const offlineDataSynced = await syncOfflineData();
    
    // 2. Sync dashboard metrics
    await syncDashboardMetrics();
    
    // 3. Sync clients and loyalty data
    await syncClientsData();
    
    // 4. Sync ticket analysis data
    await syncTicketAnalysis();
    
    // 5. Sync feedback data
    await syncFeedbackData();
    
    // Show success message
    toast({
      title: "Sincronización completada",
      description: "Todos los datos han sido sincronizados correctamente",
    });
    
    return true;
  } catch (error) {
    console.error('Error en la sincronización completa de datos:', error);
    
    toast({
      variant: "destructive",
      title: "Error de sincronización",
      description: "Ocurrió un error durante la sincronización de datos",
    });
    
    return false;
  }
};

// Re-export getSyncStatus for easier imports
export { getSyncStatus } from './syncStatusService';
// Export the syncDashboardMetrics alias
export { syncDashboardMetrics };
