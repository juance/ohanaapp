
import React, { createContext, useContext, useState, useEffect } from 'react';

type ConnectionStatus = 'online' | 'offline';
type SyncStatus = 'synchronized' | 'syncing' | 'error' | 'pending';

interface ConnectionContextType {
  connectionStatus: ConnectionStatus;
  syncStatus: SyncStatus;
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
  syncData: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType>({
  connectionStatus: 'online',
  syncStatus: 'synchronized',
  pendingSyncCount: 0,
  lastSyncedAt: null,
  syncData: async () => {}
});

export const useConnection = () => useContext(ConnectionContext);

export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('online');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synchronized');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Check connection status when the component mounts
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    // Set initial status
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending sync items in local storage
    const checkPendingItems = () => {
      try {
        const syncStatus = localStorage.getItem('syncStatus');
        if (syncStatus) {
          const syncData = JSON.parse(syncStatus);
          setPendingSyncCount(
            (syncData.pendingTickets?.length || 0) +
            (syncData.pendingExpenses?.length || 0) +
            (syncData.pendingFeedback?.length || 0)
          );
          setLastSyncedAt(syncData.lastSynced ? new Date(syncData.lastSynced) : null);
        }
      } catch (error) {
        console.error('Error checking pending sync items:', error);
      }
    };

    // Initial check and periodic checks
    checkPendingItems();
    const intervalId = setInterval(checkPendingItems, 60000); // Check every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  // Function to sync data with the server
  const syncData = async () => {
    if (connectionStatus === 'offline' || syncStatus === 'syncing') {
      return;
    }

    try {
      setSyncStatus('syncing');
      
      // Import sync functions dynamically to avoid circular dependencies
      const { syncAllData } = await import('@/lib/data/syncService');
      
      await syncAllData();
      
      setSyncStatus('synchronized');
      setLastSyncedAt(new Date());
      setPendingSyncCount(0);
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        connectionStatus,
        syncStatus,
        pendingSyncCount,
        lastSyncedAt,
        syncData
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
