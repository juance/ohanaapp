
import { useState, useCallback } from 'react';
import { ClientVisit } from '@/lib/types';

/**
 * Hook for managing client selection
 */
export const useClientSelection = (loadClientNotes: (clientId: string) => Promise<void>) => {
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  
  const handleSelectClient = useCallback(async (client: ClientVisit) => {
    setSelectedClient(client);
    await loadClientNotes(client.id);
  }, [loadClientNotes]);

  return {
    selectedClient,
    setSelectedClient,
    handleSelectClient
  };
};
