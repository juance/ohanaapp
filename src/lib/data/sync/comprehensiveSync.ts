
import { syncFeedbackData } from './feedbackSync';
import { syncClientData } from './clientsSync';
import { syncMetricsData } from './metricsSync';
import { getSyncStatus, updateSyncStatus } from './syncStatusService';
import { toast } from '@/lib/toast';
import { handleError } from '@/lib/utils/errorHandling';

/**
 * Comprehensive sync of all data
 */
export const syncAllData = async (): Promise<boolean> => {
  try {
    // Check if there is an active internet connection
    if (!navigator.onLine) {
      toast({
        variant: 'destructive',
        title: 'Sin conexión',
        description: 'No hay conexión a internet para sincronizar datos'
      });
      return false;
    }

    // Sync all data types
    const clientsResult = await syncClientData();
    const feedbackResult = await syncFeedbackData();
    const metricsResult = await syncMetricsData();
    
    // Update sync status
    await updateSyncStatus();
    
    // Check if any sync operation failed
    const success = clientsResult && feedbackResult && metricsResult;
    
    // Show toast with result
    if (success) {
      toast({
        title: 'Sincronización completa',
        description: 'Todos los datos han sido sincronizados correctamente'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Sincronización parcial',
        description: 'Algunos datos no pudieron ser sincronizados'
      });
    }
    
    return success;
  } catch (error) {
    handleError(error, 'syncAllData', 'Error durante la sincronización de datos', true);
    
    toast({
      variant: 'destructive',
      title: 'Error de sincronización',
      description: 'No se pudieron sincronizar los datos'
    });
    
    return false;
  }
};

// Export getSyncStatus from the syncStatusService
export { getSyncStatus };
