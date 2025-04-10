
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { LocalClient } from './types';

/**
 * Sync clients data
 */
export const syncClientsData = async (): Promise<boolean> => {
  try {
    // Get local clients data
    const localClients = getFromLocalStorage<LocalClient[]>('clients_data') || [];
    
    // Process any unsynced clients
    for (const client of localClients) {
      if (client.pendingSync) {
        // Check if client with this phone number already exists
        const { data: existingClient, error: queryError } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', client.phoneNumber)
          .maybeSingle();
        
        if (queryError) throw queryError;
        
        if (existingClient) {
          // Update existing client
          const { error: updateError } = await supabase
            .from('customers')
            .update({
              name: client.clientName,
              loyalty_points: client.loyaltyPoints || 0,
              free_valets: client.freeValets || 0,
              valets_count: client.valetsCount || 0,
              last_visit: new Date().toISOString()
            })
            .eq('id', existingClient.id);
          
          if (updateError) throw updateError;
        } else {
          // Create new client
          const { error: insertError } = await supabase
            .from('customers')
            .insert({
              name: client.clientName,
              phone: client.phoneNumber,
              loyalty_points: client.loyaltyPoints || 0,
              free_valets: client.freeValets || 0,
              valets_count: client.valetsCount || 0,
              last_visit: new Date().toISOString()
            });
          
          if (insertError) throw insertError;
        }
        
        // Mark as synced
        client.pendingSync = false;
      }
    }
    
    // Update local storage
    saveToLocalStorage('clients_data', localClients);
    
    console.log('Clients data synced successfully');
    return true;
  } catch (error) {
    console.error('Error syncing clients data:', error);
    return false;
  }
};
