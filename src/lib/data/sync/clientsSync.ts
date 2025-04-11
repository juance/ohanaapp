
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { LocalClient } from './types';
import { handleError } from '@/lib/utils/errorHandling';

/**
 * Sync clients data and loyalty information
 */
export const syncClientsData = async (): Promise<boolean> => {
  try {
    // Get local clients data (if any)
    const localClients = getFromLocalStorage<LocalClient[]>('clients_data') || [];

    // If there are local clients that need to be synced, process them
    if (localClients.length > 0) {
      for (const client of localClients) {
        if (client.pendingSync) {
          // Check if client exists in Supabase
          const { data: existingClient, error: clientError } = await supabase
            .from('customers')
            .select('*')
            .eq('phone', client.phoneNumber)
            .single();

          if (clientError) throw clientError;

          // Update or insert client
          if (existingClient) {
            const { error: updateError } = await supabase
              .from('customers')
              .update({
                name: client.clientName,
                loyalty_points: client.loyaltyPoints || 0,
                free_valets: client.freeValets || 0,
                valets_count: client.valetsCount || 0,
                last_visit: client.lastVisit
              })
              .eq('id', existingClient.id);

            if (updateError) throw updateError;
          } else {
            const { error: insertError } = await supabase
              .from('customers')
              .insert({
                name: client.clientName,
                phone: client.phoneNumber,
                loyalty_points: client.loyaltyPoints || 0,
                free_valets: client.freeValets || 0,
                valets_count: client.valetsCount || 0,
                last_visit: client.lastVisit
              });

            if (insertError) throw insertError;
          }

          // Mark client as synced
          client.pendingSync = false;
        }
      }

      // Update local storage with synced clients
      saveToLocalStorage('clients_data', localClients);
    }

    console.log('Clients data synced successfully');
    return true;
  } catch (error) {
    handleError(error, 'syncClientsData', 'Error al sincronizar datos de clientes', false);
    return false;
  }
};
