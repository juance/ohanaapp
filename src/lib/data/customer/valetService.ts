
import { supabase } from '@/integrations/supabase/client';
import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';
import { LocalClient } from './customerStorageService';

export const updateValetsCount = async (customerId: string, valetQuantity: number): Promise<boolean> => {
  try {
    // Primero obtenemos los datos actuales del cliente
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count, free_valets')
      .eq('id', customerId)
      .single();

    if (getError) {
      console.error('Error retrieving customer data:', getError);
      return false;
    }

    // Verificar si necesitamos reiniciar el contador (primer día del mes)
    const now = new Date();
    // Usamos la fecha actual como referencia ya que last_reset_date no existe en la tabla
    const isNewMonth = true; // Siempre reiniciamos el contador por ahora

    // Si es un nuevo mes, reiniciamos el contador de valets
    let newTotalValets = customer.valets_count;
    let newFreeValets = customer.free_valets;

    if (isNewMonth) {
      // Resetear el contador
      newTotalValets = 0;
      newFreeValets = 0;
    }

    // Sumar los nuevos valets
    newTotalValets += valetQuantity;

    // Por cada 5 valets, dar uno gratis
    if (newTotalValets >= 5) {
      // Calcular cuántos valets gratis se han ganado
      const earnedFreeValets = Math.floor(newTotalValets / 5);
      newFreeValets = earnedFreeValets;
    }

    // Actualizar en la base de datos
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        valets_count: newTotalValets,
        free_valets: newFreeValets
      })
      .eq('id', customerId);

    if (updateError) {
      console.error('Error updating customer valets:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating valets count:', error);
    return false;
  }
};

export const useFreeValet = async (customerId: string, customer: LocalClient): Promise<boolean> => {
  try {
    if (!customerId) {
      console.error('No customer ID provided');
      return false;
    }

    // Primero verificamos si el cliente tiene valets gratis disponibles
    const { data, error: getError } = await supabase
      .from('customers')
      .select('free_valets, valets_redeemed')
      .eq('id', customerId)
      .single();

    if (getError) {
      console.error('Error retrieving customer free valets:', getError);
      return false;
    }

    if (!data || data.free_valets <= 0) {
      console.error('Customer has no free valets available');
      return false;
    }

    // Actualizar en la base de datos
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        free_valets: data.free_valets - 1,
        valets_redeemed: (data.valets_redeemed || 0) + 1
      })
      .eq('id', customerId);

    if (updateError) {
      console.error('Error redeeming free valet:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error using free valet:', error);
    return false;
  }
};

export const getCustomerValetCount = async (customerId: string): Promise<{ count: number, freeValets: number } | null> => {
  try {
    // Obtener información del cliente
    const { data, error } = await supabase
      .from('customers')
      .select('valets_count, free_valets')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error retrieving client valet count:', error);
      return null;
    }

    return {
      count: data.valets_count || 0,
      freeValets: data.free_valets || 0
    };
  } catch (error) {
    console.error('Error getting client valet count:', error);
    return null;
  }
};

export const resetMonthlyValet = async (): Promise<boolean> => {
  try {
    // Obtener todos los clientes
    const { data, error } = await supabase
      .from('customers')
      .update({
        valets_count: 0,
        free_valets: 0
      })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Error resetting monthly valets:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in resetMonthlyValet:', error);
    return false;
  }
};

export const resetClientValet = async (clientId: string): Promise<boolean> => {
  try {
    // Actualizar cliente específico
    const { error } = await supabase
      .from('customers')
      .update({
        valets_count: 0,
        free_valets: 0
      })
      .eq('id', clientId);

    if (error) {
      console.error('Error resetting client valet:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in resetClientValet:', error);
    return false;
  }
};
