
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';
import { SyncStatus, SimpleSyncStatus } from '@/lib/types/sync.types';
import { dispatchConnectionStatusEvent } from '@/lib/notificationService';

type ConnectionContextValue = {
  connectionStatus: 'online' | 'offline';
  syncStatus: 'idle' | 'syncing' | 'error';
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
  syncData: () => Promise<void>;
  syncStats: {
    tickets: number;
    expenses: number;
    clients: number;
    feedback: number;
  };
};

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined);

export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnline } = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [syncStats, setSyncStats] = useState<SimpleSyncStatus>({
    tickets: 0,
    expenses: 0,
    clients: 0,
    feedback: 0
  });

  // Update connection status whenever online status changes
  useEffect(() => {
    const connectionStatus = isOnline ? 'online' : 'offline';
    
    // Dispatch connection status change event for notifications
    dispatchConnectionStatusEvent(isOnline, pendingSyncCount);
    
  }, [isOnline, pendingSyncCount]);

  // Periodically check for pending sync items
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(async () => {
      try {
        const status = getSyncStatus();
        setPendingSyncCount(status.pendingSyncCount);
      } catch (error) {
        console.error('Error checking sync status:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isOnline]);

  // Initial sync check
  useEffect(() => {
    const checkSyncStatus = async () => {
      try {
        const status = getSyncStatus();
        setPendingSyncCount(status.pendingSyncCount);
        if (status.lastSyncedAt) {
          setLastSyncedAt(status.lastSyncedAt);
        }
      } catch (error) {
        console.error('Error in initial sync check:', error);
      }
    };
    
    checkSyncStatus();
  }, []);

  const syncData = useCallback(async () => {
    if (!isOnline || syncStatus === 'syncing') return;
    
    setSyncStatus('syncing');
    
    try {
      // Implement actual sync logic here
      // This would call your synchronization services
      
      // Update last sync time
      setLastSyncedAt(new Date());
      
      // Reset pending count after successful sync
      setPendingSyncCount(0);
      
      setSyncStatus('idle');
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
    }
  }, [isOnline, syncStatus]);

  return (
    <ConnectionContext.Provider
      value={{
        connectionStatus: isOnline ? 'online' : 'offline',
        syncStatus,
        pendingSyncCount,
        lastSyncedAt,
        syncData,
        syncStats
      }}
    >
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
