
import { useState, useEffect } from 'react';
import { getClientVisitFrequency } from '@/lib/dataService';
import { ClientVisit } from '@/lib/types';

interface UseClientDataReturn {
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  frequentClients: ClientVisit[];
  clients: ClientVisit[];
  refreshData: () => Promise<void>;
}

export const useClientData = (): UseClientDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [frequentClients, setFrequentClients] = useState<ClientVisit[]>([]);
  
  const fetchClientData = async () => {
    try {
      const clients = await getClientVisitFrequency();
      setFrequentClients(clients);
    } catch (err) {
      console.error("Error fetching client data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching client data'));
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = async () => {
    setLoading(true);
    await fetchClientData();
  };
  
  useEffect(() => {
    fetchClientData();
  }, []);
  
  return {
    loading,
    isLoading: loading,
    error,
    frequentClients,
    clients: frequentClients,
    refreshData
  };
};
