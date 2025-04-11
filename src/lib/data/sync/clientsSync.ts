
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { handleError } from '@/lib/utils/errorHandling';

// Define the LocalClient interface
interface LocalClient {
  id: string;
  clientName: string;
  phoneNumber: string;
  loyaltyPoints: number;
  freeValets: number;
  valetsCount: number;
  lastVisit: string;
  pendingSync: boolean;
}

/**
 * Sync client data
 */
export const syncClientData = async (): Promise<boolean> => {
  try {
    // Get local client data
    const localClients = getFromLocalStorage<LocalClient[]>('clients');

    // Process any unsynced clients
    for (const client of localClients) {
      if (client.pendingSync) {
        // Check if client already exists by phone number
        const { data: existingClient, error: checkError } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', client.phoneNumber)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          // If error is not "no rows returned", propagate it
          throw checkError;
        }

        if (existingClient) {
          // Update existing client
          const { error: updateError } = await supabase
            .from('customers')
            .update({
              name: client.clientName,
              loyalty_points: client.loyaltyPoints,
              free_valets: client.freeValets,
              valets_count: client.valetsCount,
              last_visit: client.lastVisit
            })
            .eq('id', existingClient.id);

          if (updateError) throw updateError;
        } else {
          // Create new client
          const { error: insertError } = await supabase
            .from('customers')
            .insert([
              {
                name: client.clientName,
                phone: client.phoneNumber,
                loyalty_points: client.loyaltyPoints,
                free_valets: client.freeValets,
                valets_count: client.valetsCount,
                last_visit: client.lastVisit
              }
            ]);

          if (insertError) throw insertError;
        }

        // Mark as synced
        client.pendingSync = false;
      }
    }

    // Update local storage
    saveToLocalStorage('clients', localClients);

    console.log('Client data synced successfully');
    return true;
  } catch (error) {
    handleError(error, 'syncClientData', 'Error al sincronizar clientes', false);
    return false;
  }
};
