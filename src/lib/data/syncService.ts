
import { toast } from '@/lib/toast';
import { syncClientsData } from './sync/clientsSync';
import { syncFeedbackData } from './sync/feedbackSync';
import { storeTicketData } from './ticket/ticketStorageService'; 

export const syncOfflineData = async (): Promise<boolean> => {
  try {
    // Get locally stored data
    const clientsSynced = await syncClientsData();
    const feedbackSynced = await syncFeedbackData();
    
    if (clientsSynced && feedbackSynced) {
      toast({
        title: "Sincronización completa",
        description: "Los datos se han sincronizado correctamente"
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: "No se pudieron sincronizar todos los datos"
      });
      return false;
    }
  } catch (error) {
    console.error('Error syncing offline data:', error);
    toast({
      variant: "destructive",
      title: "Error de sincronización",
      description: "Ocurrió un error al sincronizar los datos"
    });
    return false;
  }
};
