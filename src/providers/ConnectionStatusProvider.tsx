
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/lib/toast';
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';
import { DataStatusIndicator } from '@/components/ui/data-status-indicator';
import { useInterval } from '@/hooks/use-interval';

type ConnectionStatus = 'online' | 'offline';
type SyncStatusState = 'idle' | 'syncing' | 'error' | 'success';

interface SyncStats {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  inventory: number;
}

interface SyncStatusResponse {
  pending: SyncStats;
  lastSync: string | null;
}

interface ConnectionContextType {
  connectionStatus: ConnectionStatus;
  syncStatus: SyncStatusState;
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
  syncData: () => Promise<void>;
  isPendingSync: boolean;
}

const ConnectionContext = createContext<ConnectionContextType>({
  connectionStatus: 'online',
  syncStatus: 'idle',
  pendingSyncCount: 0,
  lastSyncedAt: null,
  syncData: async () => {},
  isPendingSync: false
});

export const useConnection = () => useContext(ConnectionContext);

interface ConnectionStatusProviderProps {
  children: React.ReactNode;
  autoSyncInterval?: number; // in minutes
}

export const ConnectionStatusProvider: React.FC<ConnectionStatusProviderProps> = ({
  children,
  autoSyncInterval = 5 // default to 5 minutes
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    navigator.onLine ? 'online' : 'offline'
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>('idle');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [isPendingSync, setIsPendingSync] = useState(false);

  // Check for pending syncs
  const checkPendingSyncs = async () => {
    try {
      const status: SyncStatusResponse = await getSyncStatus();
      if (status && status.pending) {
        const totalPending =
          (status.pending.tickets || 0) +
          (status.pending.expenses || 0) +
          (status.pending.clients || 0) +
          (status.pending.feedback || 0) +
          (status.pending.inventory || 0);

        setPendingSyncCount(totalPending);
        setIsPendingSync(totalPending > 0);

        // Update last synced time if available
        if (status.lastSync) {
          setLastSyncedAt(new Date(status.lastSync));
        }
      }
    } catch (error) {
      console.error('Error checking sync status:', error);
    }
  };

  // Handle sync
  const syncData = async () => {
    if (connectionStatus === 'offline') {
      toast({
        title: "Sin conexión",
        description: "No hay conexión a internet. Los datos se sincronizarán automáticamente cuando vuelvas a estar en línea."
      });
      return;
    }

    if (syncStatus === 'syncing') {
      return;
    }

    try {
      setSyncStatus('syncing');
      const success = await syncAllData();

      if (success) {
        setSyncStatus('success');
        setLastSyncedAt(new Date());
        await checkPendingSyncs();

        if (pendingSyncCount === 0) {
          toast({
            title: "Sincronización exitosa",
            description: "Todos los datos han sido sincronizados correctamente"
          });
        }
      } else {
        setSyncStatus('error');
        toast({
          title: "Error de sincronización",
          description: "No se pudieron sincronizar algunos datos",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      setSyncStatus('error');
      toast({
        title: "Error de sincronización",
        description: "Ocurrió un error durante la sincronización",
        variant: "destructive"
      });
    } finally {
      // Reset status after a delay
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    }
  };

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('online');
      toast({
        title: "Conexión restablecida",
        description: "Tu conexión a internet ha sido restablecida"
      });
      // Auto-sync when coming back online
      syncData();
    };

    const handleOffline = () => {
      setConnectionStatus('offline');
      toast({
        title: "Sin conexión",
        description: "No hay conexión a internet. Estás trabajando en modo sin conexión."
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkPendingSyncs();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync at interval if we're online and have pending syncs
  useInterval(
    () => {
      if (connectionStatus === 'online' && isPendingSync) {
        syncData();
      }
    },
    autoSyncInterval * 60 * 1000 // convert minutes to ms
  );

  return (
    <ConnectionContext.Provider
      value={{
        connectionStatus,
        syncStatus,
        pendingSyncCount,
        lastSyncedAt,
        syncData,
        isPendingSync
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};
