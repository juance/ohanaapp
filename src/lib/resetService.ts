
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Función para limpiar todos los datos de Supabase
export const resetAllData = async (): Promise<boolean> => {
  try {
    // Limpieza de tickets y elementos relacionados
    const { error: ticketItemsError } = await supabase
      .from('dry_cleaning_items')
      .delete()
      .neq('id', ''); // Elimina todos

    if (ticketItemsError) throw ticketItemsError;

    const { error: ticketOptionsError } = await supabase
      .from('ticket_laundry_options')
      .delete()
      .neq('id', ''); // Elimina todos

    if (ticketOptionsError) throw ticketOptionsError;

    const { error: ticketsError } = await supabase
      .from('tickets')
      .delete()
      .neq('id', ''); // Elimina todos

    if (ticketsError) throw ticketsError;

    // Limpieza de inventario
    const { error: inventoryError } = await supabase
      .from('inventory_items')
      .delete()
      .neq('id', ''); // Elimina todos

    if (inventoryError) throw inventoryError;

    // Limpieza de gastos
    const { error: expensesError } = await supabase
      .from('expenses')
      .delete()
      .neq('id', ''); // Elimina todos

    if (expensesError) throw expensesError;

    // Limpieza de clientes - hacemos esto al final porque tiene referencias
    const { error: customersError } = await supabase
      .from('customers')
      .delete()
      .neq('id', ''); // Elimina todos

    if (customersError) throw customersError;

    // Limpieza de datos en localStorage
    localStorage.removeItem('laundry_tickets');
    localStorage.removeItem('laundry_expenses');
    
    toast.success('Todos los datos han sido reiniciados correctamente');
    return true;
  } catch (error) {
    console.error('Error al reiniciar los datos:', error);
    toast.error('Error al reiniciar los datos');
    return false;
  }
};
