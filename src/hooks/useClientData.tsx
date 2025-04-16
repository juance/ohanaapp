
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
      console.log('Fetching client data...');

      // Get all customers directly from the database
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, phone, name, loyalty_points, valets_count, free_valets, created_at, last_visit')
        .order('valets_count', { ascending: false });

      if (customersError) {
        console.error('Error fetching customers from Supabase:', customersError);
        throw customersError;
      }

      console.log(`Fetched ${customersData?.length || 0} customers from database`);

      // Transform customer data to ClientVisit format
      const enhancedClients = (customersData || []).map(customer => {
        return {
          id: customer.id,
          phoneNumber: customer.phone || '',
          clientName: customer.name || 'Cliente sin nombre',
          visitCount: customer.valets_count || 0,
          lastVisit: customer.last_visit || customer.created_at || '',
          valetsCount: customer.valets_count || 0,
          freeValets: customer.free_valets || 0,
          loyaltyPoints: customer.loyalty_points || 0,
          visitFrequency: `${customer.valets_count || 0} visitas`
        };
      });

      console.log('Processed client data:', enhancedClients.length, 'clients');
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
