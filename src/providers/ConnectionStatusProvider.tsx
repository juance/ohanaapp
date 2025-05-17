
import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';
import { SimpleSyncStatus } from '@/lib/types/sync.types';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';

type ConnectionStatus = 'online' | 'offline';
type SyncStatus = 'synced' | 'syncing' | 'error' | 'pending';

interface ConnectionContextType {
  connectionStatus: ConnectionStatus;
  syncStatus: SyncStatus;
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
  syncData: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize sync status from storage
    const storedStatus = getSyncStatus();
    if (storedStatus.lastSync) {
      setLastSyncedAt(new Date(storedStatus.lastSync));
    }
    
    // Calculate pending sync items
    const totalPending = 
      (storedStatus.tickets || 0) + 
      (storedStatus.expenses || 0) + 
      (storedStatus.clients || 0) + 
      (storedStatus.feedback || 0);
      
    setPendingSyncCount(totalPending);
    
    // Perform initial sync if online
    if (navigator.onLine && totalPending > 0) {
      syncData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Real sync function that uses the comprehensive sync implementation
  const syncData = async () => {
    if (connectionStatus === 'offline' || syncStatus === 'syncing') {
      return;
    }
    
    try {
      setSyncStatus('syncing');
      
      // Use the real syncAllData implementation
      const syncResult = await syncAllData();
      
      // Update the sync status
      const totalSynced = 
        syncResult.tickets + 
        syncResult.expenses + 
        syncResult.clients + 
        syncResult.feedback;
        
      setPendingSyncCount(Math.max(0, pendingSyncCount - totalSynced));
      setLastSyncedAt(syncResult.timestamp);
      setSyncStatus(totalSynced > 0 ? 'synced' : 'pending');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  };

  const value = {
    connectionStatus,
    syncStatus,
    pendingSyncCount,
    lastSyncedAt,
    syncData
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionStatusProvider');
  }
  return context;
};
