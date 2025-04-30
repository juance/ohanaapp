
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
// Fix import for SyncStatus
import { SimpleSyncStatus } from '@/lib/types/sync.types';

// Define connection status type
type ConnectionStatus = "online" | "offline";

// Define context type
interface ConnectionContextType {
  connectionStatus: ConnectionStatus;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  syncData: () => Promise<void>;
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
}

// Create context with default values
const ConnectionContext = createContext<ConnectionContextType>({
  connectionStatus: 'online',
  syncStatus: 'idle',
  syncData: async () => {},
  pendingSyncCount: 0,
  lastSyncedAt: null,
});

// Hook to use connection context
export const useConnection = () => useContext(ConnectionContext);

// Connection status provider component
export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ConnectionStatus>('online');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingSync, setPendingSync] = useState<number>(0);

  // Check network status on initial load and changes
  useEffect(() => {
    const handleOnline = () => {
      setStatus('online');
      toast.success('Conexión restaurada');
    };

    const handleOffline = () => {
      setStatus('offline');
      toast.error('Sin conexión');
    };

    // Set initial status
    setStatus(navigator.onLine ? 'online' : 'offline');

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to sync data with backend
  const syncData = async () => {
    if (status === 'offline') {
      toast.error('No hay conexión a internet');
      return;
    }

    try {
      setSyncStatus('syncing');
      // Import syncService here to avoid circular dependencies
      const { syncAllData } = await import('@/lib/data/sync/comprehensiveSync');
      const result = await syncAllData();

      // Add lastSync field to make it compatible with SimpleSyncStatus
      const syncResult: SimpleSyncStatus = {
        ...result,
        lastSync: new Date().toISOString()
      };

      setPendingSync(0);
      setLastSync(new Date());
      setSyncStatus('success');
      
      // Show toast only if there was data synced
      const totalSynced = result.tickets + result.clients + result.feedback + result.expenses;
      if (totalSynced > 0) {
        toast.success(`Sincronización completada: ${totalSynced} elementos`);
      }
    } catch (error) {
      console.error('Error during sync:', error);
      setSyncStatus('error');
      toast.error('Error al sincronizar datos');
    }
  };

  const value = {
    connectionStatus: status,
    syncStatus,
    syncData,
    pendingSyncCount: pendingSync,
    lastSyncedAt: lastSync
  };

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};
