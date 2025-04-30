
import { useState, useEffect } from 'react';
import { ClientVisit } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { CLIENTS_STORAGE_KEY } from '@/lib/constants/storageKeys';
import { convertCustomerToClientVisit } from '@/lib/types/customer.types';

export const useCachedClients = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      // Try to get clients from local storage first
      const cachedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
      if (cachedClients) {
        setClients(JSON.parse(cachedClients));
      }
      
      // Fetch fresh data from Supabase
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Convert from database format to ClientVisit format
      const clientVisits = data.map(convertCustomerToClientVisit);
      
      // Update state and cache
      setClients(clientVisits);
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clientVisits));
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching clients'));
    } finally {
      setIsLoading(false);
    }
  };

  const invalidateCache = () => {
    localStorage.removeItem(CLIENTS_STORAGE_KEY);
  };

  // Alias for refreshClients to match what useClientsList expects
  const refreshClients = fetchClients;

  useEffect(() => {
    fetchClients();
  }, []);

  return { 
    clients, 
    isLoading, 
    error, 
    refetch: fetchClients, 
    invalidateCache,
    refreshClients 
  };
};
