
import { useState, useEffect, useCallback } from 'react';
import { ClientVisit } from '@/lib/types';
import { useClientFetching } from './useClientFetching';
import { useClientCache } from './useClientCache';
import { useClientErrors } from './useClientErrors';
import { toast } from 'sonner';

interface UseClientDataReturn {
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  frequentClients: ClientVisit[];
  clients: ClientVisit[];
  refreshData: () => Promise<void>;
}

/**
 * Main hook for client data management, combining fetching, caching, and error handling
 */
export const useClientData = (): UseClientDataReturn => {
  const { loading, error, fetchClients } = useClientFetching();
  const { clientData, setClientData, getCachedClients, cacheClients, invalidateCache } = useClientCache();
  const { handleFetchError, handleRefreshSuccess } = useClientErrors();
  
  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = getCachedClients();
        if (cachedData) {
          setClientData(cachedData);
          return;
        }
      }
      
      // Fetch fresh data
      const clients = await fetchClients();
      
      // Cache the result
      cacheClients(clients);
    } catch (err) {
      handleFetchError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, [fetchClients, getCachedClients, cacheClients, handleFetchError]);
  
  const refreshData = useCallback(async () => {
    // Force a refresh by invalidating the cache first
    invalidateCache();
    
    await loadData(true);
    handleRefreshSuccess();
  }, [loadData, invalidateCache, handleRefreshSuccess]);
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  return {
    loading,
    isLoading: loading,
    error,
    frequentClients: clientData,
    clients: clientData,
    refreshData
  };
};
