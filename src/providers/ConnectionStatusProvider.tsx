
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Define the sync status types
export interface SyncStatus {
  online: boolean;
  syncing: boolean;
  error: string | null;
  lastSyncedAt: Date | null;
  pendingSyncCount: number;
}

interface ConnectionContextType {
  connectionStatus: 'online' | 'offline';
  syncStatus: 'synced' | 'syncing' | 'error' | 'pending';
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
  syncData: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOnline } = useNetworkStatus();
  const [syncState, setSyncState] = useState<SyncStatus>({
    online: isOnline,
    syncing: false,
    error: null,
    lastSyncedAt: null,
    pendingSyncCount: 0
  });

  // Update online status when network changes
  useEffect(() => {
    setSyncState(prev => ({ ...prev, online: isOnline }));
  }, [isOnline]);

  // Mock function to simulate syncing data
  const syncData = async () => {
    if (!isOnline) {
      return;
    }

    try {
      setSyncState(prev => ({ ...prev, syncing: true }));
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSyncState({
        online: isOnline,
        syncing: false,
        error: null,
        lastSyncedAt: new Date(),
        pendingSyncCount: 0
      });
    } catch (err) {
      setSyncState(prev => ({
        ...prev,
        syncing: false,
        error: err instanceof Error ? err.message : 'Error de sincronización'
      }));
    }
  };

  // Determine the current sync status
  let currentSyncStatus: 'synced' | 'syncing' | 'error' | 'pending';
  
  if (syncState.syncing) {
    currentSyncStatus = 'syncing';
  } else if (syncState.error) {
    currentSyncStatus = 'error';
  } else if (syncState.pendingSyncCount > 0) {
    currentSyncStatus = 'pending';
  } else {
    currentSyncStatus = 'synced';
  }

  const value = {
    connectionStatus: isOnline ? 'online' : 'offline',
    syncStatus: currentSyncStatus,
    pendingSyncCount: syncState.pendingSyncCount,
    lastSyncedAt: syncState.lastSyncedAt,
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
