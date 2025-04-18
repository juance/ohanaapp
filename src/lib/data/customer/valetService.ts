
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

    if (getError) throw getError;

    const currentValets = customer?.valets_count || 0;
    let currentFreeValets = customer?.free_valets || 0;

    // Verificar si necesitamos reiniciar el contador (primer día del mes)
    const now = new Date();
    // Usamos la fecha actual como referencia ya que last_reset_date no existe en la tabla
    const isNewMonth = true; // Siempre reiniciamos el contador por ahora

    // Si es un nuevo mes, reiniciamos el contador de valets
    let newTotalValets = currentValets;
    if (isNewMonth) {
      console.log(`Reiniciando contador de valets para cliente ${customerId} (nuevo mes)`);
      newTotalValets = valetQuantity; // Empezamos de nuevo con los valets actuales
    } else {
      newTotalValets = currentValets + valetQuantity;
    }

    // Por cada 9 valets completados, se otorga 1 valet gratis
    // Los valets gratis no se reinician mensualmente, solo el contador
    const newFreeValetsEarned = Math.floor(newTotalValets / 9) - Math.floor(currentValets / 9);
    const newFreeValets = currentFreeValets + newFreeValetsEarned;

    // Actualizamos en la base de datos
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        valets_count: newTotalValets,
        free_valets: newFreeValets
      })
      .eq('id', customerId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error updating valets count:', error);
    return false;
  }
};

export const useFreeValet = async (customerId: string): Promise<boolean> => {
  try {
    // Primero verificamos si el cliente tiene valets gratis disponibles
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('free_valets')
      .eq('id', customerId)
      .single();

    if (getError) throw getError;

    const freeValets = customer?.free_valets || 0;

    // Si no tiene valets gratis disponibles, retornamos error
    if (freeValets <= 0) {
      return false;
    }

    // Actualizamos reduciendo en 1 los valets gratis
    const { error: updateError } = await supabase
      .from('customers')
      .update({ free_valets: freeValets - 1 })
      .eq('id', customerId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error using free valet:', error);
    return false;
  }
};

// Add the missing getCustomerValetCount function
export const getCustomerValetCount = async (customerId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('valets_count')
      .eq('id', customerId)
      .single();

    if (error) throw error;
    return data?.valets_count || 0;
  } catch (error) {
    console.error('Error getting customer valet count:', error);
    return 0;
  }
};
