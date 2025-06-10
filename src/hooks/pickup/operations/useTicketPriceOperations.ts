
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Hook for ticket price operations
 */
export const useTicketPriceOperations = () => {
  /**
   * Update ticket price
   */
  const handleUpdateTicketPrice = async (ticketId: string, newPrice: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          total: newPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      console.log(`Ticket ${ticketId} price updated to ${newPrice}`);
    } catch (error) {
      console.error('Error updating ticket price:', error);
      throw error;
    }
  };

  return {
    handleUpdateTicketPrice
  };
};
