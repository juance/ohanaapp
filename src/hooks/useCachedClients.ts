
import { useState, useEffect } from 'react';
import { getAllClients } from '@/lib/dataService';
import { ClientVisit, Customer, convertCustomerToClientVisit } from '@/lib/types';
import { cacheService } from '@/lib/services/cacheService';

export const useCachedClients = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const CACHE_KEY = 'clients_list';

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Check cache first
      const cachedData = cacheService.get<ClientVisit[]>(CACHE_KEY);
      
      if (cachedData) {
        setClients(cachedData);
        setIsLoading(false);
        
        // Refresh in background
        refreshClientsInBackground();
        return;
      }
      
      // No cache, fetch from API
      const data = await getAllClients();
      const clientVisits = data.map(customer => convertCustomerToClientVisit(customer));
      setClients(clientVisits);
      
      // Save to cache
      cacheService.set(CACHE_KEY, clientVisits, 60 * 5); // Cache for 5 minutes
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshClientsInBackground = async () => {
    try {
      const freshData = await getAllClients();
      const clientVisits = freshData.map(customer => convertCustomerToClientVisit(customer));
      setClients(clientVisits);
      cacheService.set(CACHE_KEY, clientVisits, 60 * 5); // Update cache
    } catch (err) {
      console.error('Error refreshing clients in background:', err);
      // Don't set error state here as this is a background refresh
    }
  };
  
  const invalidateCache = () => {
    cacheService.remove(CACHE_KEY);
    fetchClients();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    invalidateCache
  };
};
