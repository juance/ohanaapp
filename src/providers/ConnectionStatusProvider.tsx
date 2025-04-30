
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';
import { isOnline } from '@/lib/connectionUtils';
import { SyncStatus } from '@/lib/types/sync.types';

interface ConnectionStatusContextType {
  online: boolean;
  syncStatus: SyncStatus;
  lastChecked: Date;
}

const ConnectionStatusContext = createContext<ConnectionStatusContextType>({
  online: true,
  syncStatus: {
    tickets: 0,
    expenses: 0,
    clients: 0,
    feedback: 0,
    lastSync: '',
    pendingSyncCount: 0
  },
  lastChecked: new Date()
});

export const useConnectionStatus = () => useContext(ConnectionStatusContext);

export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [online, setOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    tickets: 0,
    expenses: 0,
    clients: 0,
    feedback: 0,
    lastSync: '',
    pendingSyncCount: 0
  });
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    // Check initial connection status
    setOnline(isOnline());

    // Set up event listeners for online/offline status
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check sync status periodically
    const checkSyncStatus = () => {
      const status = getSyncStatus();
      const pendingCount = status.tickets + status.expenses + status.clients + status.feedback;
      
      setSyncStatus({
        ...status,
        pendingSyncCount: pendingCount
      });
      setLastChecked(new Date());
    };
    
    // Check immediately
    checkSyncStatus();
    
    // Set up interval to check periodically
    const interval = setInterval(checkSyncStatus, 30000); // Every 30 seconds
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);
  
  // Format the last sync time for display
  const formattedSyncStatus = {
    ...syncStatus,
    pendingSyncCount: syncStatus.tickets + syncStatus.expenses + syncStatus.clients + syncStatus.feedback,
    lastSyncedAt: syncStatus.lastSync || 'Never'
  };

  return (
    <ConnectionStatusContext.Provider value={{ 
      online, 
      syncStatus: formattedSyncStatus, 
      lastChecked 
    }}>
      {children}
    </ConnectionStatusContext.Provider>
  );
};
