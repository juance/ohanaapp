
import { useState, useEffect } from 'react';
import { getClientVisitFrequency } from '@/lib/dataService';
import { ClientVisit } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Get all customers from the database to include loyalty data
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, phone, name, loyalty_points, valets_count, free_valets');
        
      if (customersError) throw customersError;
      
      // Enhance client data with default values and loyalty info
      const enhancedClients = clients.map(client => {
        // Find matching customer in database for loyalty information
        const customerMatch = customersData?.find(c => c.phone === client.phoneNumber);
        
        return {
          id: customerMatch?.id || client.id || client.phoneNumber, // Use database ID if available
          phoneNumber: client.phoneNumber,
          clientName: client.clientName,
          visitCount: client.visitCount || 0,
          lastVisit: client.lastVisit || '',
          // Add loyalty information from the database
          valetsCount: customerMatch?.valets_count || 0, 
          freeValets: customerMatch?.free_valets || 0,
          loyaltyPoints: customerMatch?.loyalty_points || 0,
          visitFrequency: `${client.visitCount || 0} visits`
        };
      });
      
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
