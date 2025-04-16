import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Incrementa el contador de visitas de un cliente y actualiza los valets gratis si corresponde
 * @param customerId ID del cliente
 * @param valetQuantity Cantidad de valets a incrementar
 * @returns true si se actualizó correctamente, false en caso contrario
 */
export const incrementCustomerVisits = async (customerId: string, valetQuantity: number = 1): Promise<boolean> => {
  try {
    console.log(`Incrementando visitas para cliente ${customerId} en ${valetQuantity}`);
    
    // 1. Obtener los datos actuales del cliente
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count, free_valets, name')
      .eq('id', customerId)
      .single();
    
    if (getError) {
      console.error('Error al obtener datos del cliente:', getError);
      return false;
    }
    
    // 2. Calcular nuevos valores
    const currentValets = customer?.valets_count || 0;
    const currentFreeValets = customer?.free_valets || 0;
    const newValetsCount = currentValets + valetQuantity;
    
    // 3. Verificar si el cliente ha alcanzado 9 visitas para un valet gratis
    const previousMilestone = Math.floor(currentValets / 9);
    const newMilestone = Math.floor(newValetsCount / 9);
    const newFreeValets = currentFreeValets + (newMilestone - previousMilestone);
    
    console.log(`Cliente ${customer?.name || customerId}:
      - Visitas actuales: ${currentValets}
      - Nuevas visitas: ${newValetsCount}
      - Valets gratis actuales: ${currentFreeValets}
      - Nuevos valets gratis: ${newFreeValets}
    `);
    
    // 4. Actualizar en la base de datos
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        valets_count: newValetsCount,
        free_valets: newFreeValets
      })
      .eq('id', customerId);
    
    if (updateError) {
      console.error('Error al actualizar contador de visitas:', updateError);
      return false;
    }
    
    // 5. Mostrar notificación si ganó un valet gratis
    if (newFreeValets > currentFreeValets) {
      toast({
        title: "¡Valet gratis ganado!",
        description: `${customer?.name || 'Cliente'} ha ganado un valet gratis por su fidelidad`,
        variant: "success"
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error en incrementCustomerVisits:', error);
    return false;
  }
};

/**
 * Usa un valet gratis de un cliente
 * @param customerId ID del cliente
 * @returns true si se usó correctamente, false en caso contrario
 */
export const useCustomerFreeValet = async (customerId: string): Promise<boolean> => {
  try {
    // 1. Obtener los datos actuales del cliente
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('free_valets, name')
      .eq('id', customerId)
      .single();
    
    if (getError) {
      console.error('Error al obtener datos del cliente:', getError);
      return false;
    }
    
    // 2. Verificar si tiene valets gratis disponibles
    const currentFreeValets = customer?.free_valets || 0;
    if (currentFreeValets <= 0) {
      toast({
        title: "Sin valets gratis",
        description: `${customer?.name || 'Cliente'} no tiene valets gratis disponibles`,
        variant: "destructive"
      });
      return false;
    }
    
    // 3. Actualizar en la base de datos
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        free_valets: currentFreeValets - 1,
        valets_redeemed: supabase.rpc('increment', { x: 1 })
      })
      .eq('id', customerId);
    
    if (updateError) {
      console.error('Error al usar valet gratis:', updateError);
      return false;
    }
    
    toast({
      title: "Valet gratis usado",
      description: `${customer?.name || 'Cliente'} ha usado un valet gratis`,
      variant: "success"
    });
    
    return true;
  } catch (error) {
    console.error('Error en useCustomerFreeValet:', error);
    return false;
  }
};

/**
 * Reinicia el contador de visitas de todos los clientes (para uso mensual)
 * @returns true si se reinició correctamente, false en caso contrario
 */
export const resetAllCustomerVisits = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customers')
      .update({
        valets_count: 0
      })
      .not('id', 'is', null);
    
    if (error) {
      console.error('Error al reiniciar contadores de visitas:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error en resetAllCustomerVisits:', error);
    return false;
  }
};
