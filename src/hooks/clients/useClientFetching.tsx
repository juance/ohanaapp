
import { useState, useCallback } from 'react';
import { ClientVisit } from '@/lib/types';
import { getClientVisitFrequency } from '@/lib/dataService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook for fetching client data from the API and database
 */
export const useClientFetching = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch client visit data
      const clients = await getClientVisitFrequency();
      
      try {
        // Get all customers from the database to include loyalty data
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('id, phone, name, loyalty_points, valets_count, free_valets, notes');
          
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
            notes: customerMatch?.notes || '',
            visitFrequency: `${client.visitCount || 0} visits`
          };
        });
        
        return enhancedClients;
      } catch (err) {
        console.error("Error fetching customer loyalty data:", err);
        // Still show clients but without loyalty data
        return clients.map(client => ({
          ...client,
          valetsCount: 0,
          freeValets: 0,
          loyaltyPoints: 0,
          notes: '',
          visitFrequency: `${client.visitCount || 0} visits`
        }));
      }
    } catch (err) {
      console.error("Error fetching client data:", err);
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar datos de clientes'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchClients
  };
};
