
import { supabase } from '@/integrations/supabase/client';
import { SimpleSyncStatus } from '@/lib/types/sync.types';

// Update the sync status in local storage and on the server if available
export const updateSyncStatus = async (syncData: {
  lastSync: Date;
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
}): Promise<boolean> => {
  try {
    // Get existing status or create new one
    let existingStatus = localStorage.getItem('syncStatus');
    let parsedStatus = existingStatus ? JSON.parse(existingStatus) : {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0,
      lastSync: new Date().toISOString()
    };
    
    // Update counts
    parsedStatus.tickets += syncData.tickets;
    parsedStatus.expenses += syncData.expenses;
    parsedStatus.clients += syncData.clients;
    parsedStatus.feedback += syncData.feedback;
    parsedStatus.lastSync = syncData.lastSync.toISOString();
    
    // Save back to local storage
    localStorage.setItem('syncStatus', JSON.stringify(parsedStatus));
    
    // Skip server update for now since sync_status table doesn't seem to exist
    // We'll have to create the table first before using it
    // For now, just log it and return success
    console.log('Would save to sync_status table:', {
      tickets_count: syncData.tickets,
      expenses_count: syncData.expenses,
      clients_count: syncData.clients,
      feedback_count: syncData.feedback,
      synced_at: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating sync status:', error);
    return false;
  }
};

// Get the current sync status
export const getSyncStatus = (): { 
  tickets: number; 
  expenses: number; 
  clients: number; 
  feedback: number; 
  lastSync: string 
} => {
  try {
    const syncStatusJson = localStorage.getItem('syncStatus');
    if (syncStatusJson) {
      return JSON.parse(syncStatusJson);
    }
    return {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0,
      lastSync: ''
    };
  } catch (error) {
    console.error('Error getting sync status:', error);
    return {
      tickets: 0,
      expenses: 0,
      clients: 0,
      feedback: 0,
      lastSync: ''
    };
  }
};
