
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientVisit } from '@/lib/types';
import { toast } from '@/lib/toast';
import { logError } from '@/lib/errorService';

export const useClientsList = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      const mappedClients: ClientVisit[] = data.map(client => ({
        id: client.id,
        customerId: client.id,
        customerName: client.name,
        clientName: client.name,
        phoneNumber: client.phone,
        visitCount: client.valets_count || 0,
        visitDate: client.last_visit || new Date().toISOString(),
        total: 0,
        isPaid: false,
        lastVisit: client.last_visit,
        loyaltyPoints: client.loyalty_points || 0,
        freeValets: client.free_valets || 0,
        valetsCount: client.valets_count || 0
      }));

      setClients(mappedClients);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error('Error fetching clients'));
      
      // Log the error through our error service
      await logError(err, { component: 'useClientsList' });
      
      // Show toast notification
      toast.error('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load clients on initial mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const refreshClients = useCallback(async () => {
    await fetchClients();
  }, [fetchClients]);

  return { 
    clients, 
    isLoading, 
    error, 
    refreshClients,
    refetch: refreshClients // Add refetch as an alias for compatibility
  };
};
