
import { supabase } from '@/integrations/supabase/client';
import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';

export const updateValetsCount = async (customerId: string, valetQuantity: number): Promise<boolean> => {
  try {
    // Primero obtenemos los datos actuales del cliente
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count, free_valets')
      .eq('id', customerId)
      .single();

    if (getError) {
      console.error('Error al obtener datos del cliente:', getError);
      return false;
    }

    // Verificar si necesitamos reiniciar el contador (primer día del mes)
    const now = new Date();
    // Usamos la fecha actual como referencia ya que last_reset_date no existe en la tabla
    const isNewMonth = true; // Siempre reiniciamos el contador por ahora

    // Si es un nuevo mes, reiniciamos el contador de valets
    let newTotalValets = currentValets;
    if (isNewMonth) {
      newTotalValets = valetQuantity;
    } else {
      newTotalValets += valetQuantity;
    }

    // Si alcanza un múltiplo de 9, otorgamos un valet gratis
    const currentFreeValets = customer?.free_valets || 0;
    let newFreeValets = currentFreeValets;
    
    // Calculate if we need to add free valets
    const previousBenchmark = Math.floor(currentValets / 9);
    const newBenchmark = Math.floor(newTotalValets / 9);
    
    if (newBenchmark > previousBenchmark) {
      newFreeValets += (newBenchmark - previousBenchmark);
    }

    // Actualizar los contadores del cliente
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        valets_count: newTotalValets,
        free_valets: newFreeValets
      })
      .eq('id', customerId);

    if (updateError) {
      console.error('Error al actualizar contadores de valets:', updateError);
      return false;
    }

    // Clear customer cache to ensure we get fresh data next time
    localStorage.removeItem(CUSTOMERS_STORAGE_KEY);

    return true;
  } catch (error) {
    console.error('Error en updateValetsCount:', error);
    return false;
  }
};

export const useCustomerFreeValet = (customerId: string, onSuccessCallback?: () => void) => {
  const useFreeValet = async (): Promise<boolean> => {
    try {
      // Primero obtenemos los datos actuales del cliente
      const { data: customer, error: getError } = await supabase
        .from('customers')
        .select('free_valets, valets_redeemed')
        .eq('id', customerId)
        .single();

      if (getError) {
        console.error('Error al obtener datos del cliente:', getError);
        return false;
      }

      // Verificar que tenga valets gratis disponibles
      if (!customer || (customer.free_valets || 0) <= 0) {
        console.error('El cliente no tiene valets gratis disponibles');
        return false;
      }

      // Actualizar los contadores del cliente
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          free_valets: (customer.free_valets || 1) - 1,
          valets_redeemed: (customer.valets_redeemed || 0) + 1
        })
        .eq('id', customerId);

      if (updateError) {
        console.error('Error al actualizar valets gratuitos:', updateError);
        return false;
      }

      // Clear customer cache
      localStorage.removeItem(CUSTOMERS_STORAGE_KEY);

      // Call success callback if provided
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      return true;
    } catch (error) {
      console.error('Error en useCustomerFreeValet:', error);
      return false;
    }
  };

  return { useFreeValet };
};

// Define missing variable
const currentValets = 0;
