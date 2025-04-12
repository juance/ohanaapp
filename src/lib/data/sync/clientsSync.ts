
import { supabase } from '@/integrations/supabase/client';
import { LocalClient } from '@/lib/types';

/**
 * Sync local clients data with Supabase
 */
export const syncClients = async (): Promise<number> => {
  let syncedCount = 0;

  try {
    // Get all local clients
    const localClients = getLocalClients();

    // Find clients with pendingSync flag
    const pendingClients = localClients.filter(client => client.pendingSync);

    // Upload each pending client
    for (const client of pendingClients) {
      // First check if client already exists by phone number
      const { data: existingClient } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', client.phoneNumber)
        .single();

      if (existingClient) {
        // Update existing client
        await supabase
          .from('customers')
          .update({
            name: client.clientName,
            loyalty_points: client.loyaltyPoints || 0,
            free_valets: client.freeValets || 0,
            valets_count: client.valetsCount || 0,
            last_visit: client.lastVisit || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingClient.id);
      } else {
        // Insert new client
        await supabase
          .from('customers')
          .insert({
            name: client.clientName,
            phone: client.phoneNumber,
            loyalty_points: client.loyaltyPoints || 0,
            free_valets: client.freeValets || 0,
            valets_count: client.valetsCount || 0,
            last_visit: client.lastVisit || null
          });
      }

      // Mark as synced
      client.pendingSync = false;
      syncedCount++;
    }

    // Save back to localStorage
    saveLocalClients(localClients);

    return syncedCount;
  } catch (error) {
    console.error('Error syncing clients:', error);
    return 0;
  }
};

/**
 * Alias for syncClients for backward compatibility
 */
export const syncClientData = syncClients;

// Helper function to get local clients from localStorage
const getLocalClients = (): LocalClient[] => {
  try {
    const clientsJson = localStorage.getItem('clients');
    return clientsJson ? JSON.parse(clientsJson) : [];
  } catch (e) {
    console.error('Error parsing local clients:', e);
    return [];
  }
};

// Helper function to save clients to localStorage
const saveLocalClients = (clients: LocalClient[]): void => {
  localStorage.setItem('clients', JSON.stringify(clients));
};
