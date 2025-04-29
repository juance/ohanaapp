
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from '@/lib/toast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';
import { syncAllData } from '@/lib/data/syncComprehensiveService';
import { SyncStatus } from '@/lib/types/sync.types';

interface ConnectionStatusContextType {
  online: boolean;
  lastSyncTimestamp: Date | null;
  pendingSync: number;
  isSyncing: boolean;
  syncStatus: SyncStatus | null;
  sync: () => Promise<void>;
}

const ConnectionStatusContext = createContext<ConnectionStatusContextType | null>(null);

export const useConnectionStatus = () => {
  const context = useContext(ConnectionStatusContext);
  if (!context) {
    throw new Error('useConnectionStatus must be used within ConnectionStatusProvider');
  }
  return context;
};

interface ConnectionStatusProviderProps {
  children: ReactNode;
}

export const ConnectionStatusProvider: React.FC<ConnectionStatusProviderProps> = ({ children }) => {
  const { online } = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Cargar estado de sincronización al inicio
    refreshSyncStatus();

    // Si vuelve a estar online después de estar offline, ofrecer sincronizar
    const handleOnlineStatusChange = () => {
      if (online && syncStatus?.pending) {
        toast({
          title: 'Conexión restaurada',
          description: `Hay ${syncStatus.pending} elementos pendientes de sincronización. ¿Desea sincronizar ahora?`,
          variant: 'default',
          action: {
            label: 'Sincronizar',
            onClick: () => sync()
          }
        });
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
    };
  }, [online, syncStatus]);

  const refreshSyncStatus = () => {
    try {
      const status = getSyncStatus();
      setSyncStatus(status);
      return status;
    } catch (error) {
      console.error('Error refreshing sync status:', error);
      return null;
    }
  };

  const sync = async () => {
    if (isSyncing || !online) return;
    
    setIsSyncing(true);
    toast.loading('Sincronizando datos...');
    
    try {
      await syncAllData();
      const newStatus = refreshSyncStatus();
      
      toast.success(`Sincronización completada. Último registro: ${newStatus?.lastSync ? new Date(newStatus.lastSync).toLocaleString() : 'N/A'}`);
    } catch (error) {
      console.error('Error during sync:', error);
      toast.error('Error durante la sincronización');
    } finally {
      setIsSyncing(false);
    }
  };

  const value: ConnectionStatusContextType = {
    online,
    lastSyncTimestamp: syncStatus?.lastSync || null,
    pendingSync: syncStatus?.pending || 0,
    isSyncing,
    syncStatus,
    sync
  };

  return (
    <ConnectionStatusContext.Provider value={value}>
      {children}
    </ConnectionStatusContext.Provider>
  );
};
