
import React, { createContext, useContext, useState, useEffect } from 'react';

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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mock sync function - replace with real sync logic
  const syncData = async () => {
    if (connectionStatus === 'offline' || syncStatus === 'syncing') {
      return;
    }
    
    try {
      setSyncStatus('syncing');
      
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be your sync logic
      
      setLastSyncedAt(new Date());
      setPendingSyncCount(0);
      setSyncStatus('synced');
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
