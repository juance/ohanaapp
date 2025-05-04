// Connection Status Provider
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode
} from 'react';
import { useNavigate } from 'react-router-dom';
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';
import { getSyncStatus } from '@/lib/data/sync/syncStatusService';
import { SimpleSyncStatus } from '@/lib/types/sync.types';

interface ConnectionStatusContextProps {
  isConnected: boolean;
  isSyncing: boolean;
  lastSync: string | null;
  syncError: string | null;
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
  sync: () => Promise<void>;
}

const ConnectionStatusContext = createContext<ConnectionStatusContextProps>({
  isConnected: navigator.onLine,
  isSyncing: false,
  lastSync: null,
  syncError: null,
  tickets: 0,
  expenses: 0,
  clients: 0,
  feedback: 0,
  sync: async () => {}
});

interface ConnectionStatusProviderProps {
  children: ReactNode;
}

const ConnectionStatusProvider: React.FC<ConnectionStatusProviderProps> = ({
  children
}) => {
  const [isConnected, setIsConnected] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<number | undefined>(0);
  const [expenses, setExpenses] = useState<number | undefined>(0);
  const [clients, setClients] = useState<number | undefined>(0);
  const [feedback, setFeedback] = useState<number | undefined>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const initialSyncStatus = getSyncStatus();
    setLastSync(initialSyncStatus.lastSync || null);
    setTickets(initialSyncStatus.tickets);
    setExpenses(initialSyncStatus.expenses);
    setClients(initialSyncStatus.clients);
    setFeedback(initialSyncStatus.feedback);
  }, []);

  const sync = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const result = await syncAllData();
      const syncStatus = handleSyncComplete(result);
      setLastSync(syncStatus.lastSync);
      setTickets(syncStatus.tickets);
      setExpenses(syncStatus.expenses);
      setClients(syncStatus.clients);
      setFeedback(syncStatus.feedback);
      navigate('/');
    } catch (error: any) {
      console.error('Sync error:', error);
      setSyncError(error.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncComplete = (result: {
    tickets: number;
    expenses: number;
    feedback: number;
    clients: number;
    timestamp: Date;
  }) => {
    const syncStatus: SimpleSyncStatus = {
      lastSync: result.timestamp.toISOString(),
      syncInProgress: false,
      syncError: null,
      tickets: result.tickets,
      expenses: result.expenses,
      clients: result.clients,
      feedback: result.feedback
    };
    
    // Update sync status
    localStorage.setItem('syncStatus', JSON.stringify(syncStatus));
    
    return syncStatus;
  };

  return (
    <ConnectionStatusContext.Provider
      value={{
        isConnected,
        isSyncing,
        lastSync,
        syncError,
        tickets,
        expenses,
        clients,
        feedback,
        sync
      }}
    >
      {children}
    </ConnectionStatusContext.Provider>
  );
};

const useConnectionStatus = () => {
  return useContext(ConnectionStatusContext);
};

export { ConnectionStatusProvider, useConnectionStatus };
