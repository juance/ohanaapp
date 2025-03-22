
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
      // Enhance client data with default values for any missing properties
      const enhancedClients = clients.map(client => ({
        id: client.id || client.phoneNumber, // Use phone as fallback ID
        phoneNumber: client.phoneNumber,
        clientName: client.clientName,
        visitCount: client.visitCount || 0,
        lastVisit: client.lastVisit || '',
        // Add default values for properties that might be missing
        valetsCount: client.valetsCount || 0, 
        freeValets: client.freeValets || 0,
        visitFrequency: `${client.visitCount || 0} visits`
      }));
      setFrequentClients(enhancedClients);
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
