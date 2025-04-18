
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';
import { toast } from '@/lib/toast';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/data/coreUtils';
import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';

/**
 * Incrementa los puntos de fidelidad de un cliente
 * @param customerId ID del cliente
 * @param points Puntos a agregar
 */
export const incrementLoyaltyPoints = async (customerId: string, points: number = 100): Promise<boolean> => {
  try {
    if (!customerId) {
      console.error('No customer ID provided');
      return false;
    }

    // Update local storage first
    const localClients = getFromLocalStorage<Customer[]>(CUSTOMERS_STORAGE_KEY) || [];
    const clientIndex = localClients.findIndex(c => c.id === customerId);
    
    if (clientIndex >= 0) {
      // Update the client's points
      const currentPoints = localClients[clientIndex].loyalty_points || 0;
      localClients[clientIndex].loyalty_points = currentPoints + points;
      
      // Save back to local storage
      saveToLocalStorage(CUSTOMERS_STORAGE_KEY, localClients);
    }

    // Also update in Supabase
    const { error } = await supabase
      .from('customers')
      .update({ 
        loyalty_points: supabase.rpc('increment_loyalty_points', { 
          client_id: customerId, 
          points_to_add: points 
        })
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error incrementing loyalty points:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los puntos de fidelidad.",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Puntos Agregados",
      description: `Se han agregado ${points} puntos de fidelidad.`,
      variant: "default"
    });
    
    return true;
  } catch (error) {
    console.error('Error in incrementLoyaltyPoints:', error);
    return false;
  }
};

/**
 * Utiliza un valet gratis para un cliente
 * @param customerId ID del cliente
 * @returns Promise<boolean> true si se utilizó correctamente
 */
export const useCustomerFreeValet = async (customerId: string): Promise<boolean> => {
  try {
    if (!customerId) {
      console.error('No customer ID provided');
      return false;
    }

    // Update local storage first
    const localClients = getFromLocalStorage<Customer[]>(CUSTOMERS_STORAGE_KEY) || [];
    const clientIndex = localClients.findIndex(c => c.id === customerId);
    
    if (clientIndex >= 0) {
      if (localClients[clientIndex].free_valets > 0) {
        // Update the client's free valets
        localClients[clientIndex].free_valets -= 1;
        // Increment redeemed valets if the property exists
        if (typeof localClients[clientIndex].valets_redeemed === 'number') {
          localClients[clientIndex].valets_redeemed += 1;
        } else {
          localClients[clientIndex].valets_redeemed = 1;
        }
        
        // Save back to local storage
        saveToLocalStorage(CUSTOMERS_STORAGE_KEY, localClients);
      } else {
        toast({
          title: "Error",
          description: "El cliente no tiene valets gratis disponibles.",
          variant: "destructive"
        });
        return false;
      }
    }

    // Also update in Supabase
    const { data, error } = await supabase
      .from('customers')
      .update({ 
        free_valets: supabase.rpc('decrement_free_valets', { 
          client_id: customerId
        }),
        valets_redeemed: supabase.rpc('increment_valets_redeemed', { 
          client_id: customerId
        })
      })
      .eq('id', customerId)
      .select('free_valets');

    if (error) {
      console.error('Error using free valet:', error);
      toast({
        title: "Error",
        description: "No se pudo utilizar el valet gratis.",
        variant: "destructive"
      });
      return false;
    }

    if (data && data[0] && data[0].free_valets < 0) {
      toast({
        title: "Error",
        description: "El cliente no tiene valets gratis disponibles.",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Valet Utilizado",
      description: "Se ha utilizado un valet gratis.",
      variant: "default"
    });
    
    return true;
  } catch (error) {
    console.error('Error in useCustomerFreeValet:', error);
    return false;
  }
};

/**
 * Incrementa el contador de visitas de un cliente
 * @param customerId ID del cliente
 */
export const incrementCustomerVisits = async (customerId: string): Promise<boolean> => {
  try {
    if (!customerId) {
      console.error('No customer ID provided');
      return false;
    }

    // Update local storage first
    const localClients = getFromLocalStorage<Customer[]>(CUSTOMERS_STORAGE_KEY) || [];
    const clientIndex = localClients.findIndex(c => c.id === customerId);
    
    if (clientIndex >= 0) {
      // Update the client's visits count
      const currentVisits = localClients[clientIndex].valets_count || 0;
      localClients[clientIndex].valets_count = currentVisits + 1;
      localClients[clientIndex].last_visit = new Date().toISOString();
      
      // Check if the client should receive a free valet
      if ((currentVisits + 1) % 10 === 0) {
        localClients[clientIndex].free_valets = (localClients[clientIndex].free_valets || 0) + 1;
        toast({
          title: "¡Felicidades!",
          description: "El cliente ha ganado un valet gratis por su fidelidad.",
          variant: "default"
        });
      }
      
      // Save back to local storage
      saveToLocalStorage(CUSTOMERS_STORAGE_KEY, localClients);
    }

    // Also update in Supabase
    const { error } = await supabase
      .from('customers')
      .update({ 
        valets_count: supabase.rpc('increment_valets_count', { 
          client_id: customerId
        }),
        last_visit: new Date().toISOString()
      })
      .eq('id', customerId);

    if (error) {
      console.error('Error incrementing customer visits:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in incrementCustomerVisits:', error);
    return false;
  }
};
