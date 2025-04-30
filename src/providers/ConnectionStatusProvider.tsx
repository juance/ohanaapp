
import React, { createContext, useContext, useEffect, useState } from 'react';
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';
import { SyncStatus } from '@/lib/types/sync.types';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

interface ConnectionContextType {
  connectionStatus: 'online' | 'offline';
  syncStatus: 'idle' | 'syncing' | 'error' | 'success';
  syncData: () => Promise<void>;
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionStatusProvider');
  }
  return context;
}

export function ConnectionStatusProvider({ children }: { children: React.ReactNode }) {
  const { isOnline } = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error' | 'success'>('idle');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Function to sync data
  const syncData = async () => {
    if (!isOnline) {
      console.warn('Cannot sync while offline');
      return;
    }

    try {
      setSyncStatus('syncing');
      const result = await syncAllData();
      
      // Update last sync time and pending count
      setLastSyncedAt(new Date());
      
      // Get total count of synced items
      const totalSynced = 
        result.tickets + 
        result.clients + 
        result.expenses + 
        result.feedback;
        
      setPendingSyncCount(prev => Math.max(0, prev - totalSynced));
      setSyncStatus('success');
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
    }
  };

  // Check for pending sync items on mount and when connection status changes
  useEffect(() => {
    if (isOnline) {
      const checkPendingSync = async () => {
        try {
          const status = await getSyncStatus();
          
          // Get the last sync time
          const lastSyncTime = status?.lastSync 
            ? new Date(status.lastSync) 
            : null;
            
          setLastSyncedAt(lastSyncTime);
          
          // Calculate pending sync count
          const pendingCount = 
            (status?.tickets || 0) + 
            (status?.clients || 0) + 
            (status?.feedback || 0) + 
            (status?.expenses || 0);
            
          setPendingSyncCount(pendingCount);
        } catch (error) {
          console.error('Error checking pending sync:', error);
        }
      };
      
      checkPendingSync();
    }
  }, [isOnline]);

  const value = {
    connectionStatus: isOnline ? 'online' : 'offline',
    syncStatus,
    syncData,
    pendingSyncCount,
    lastSyncedAt
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}
