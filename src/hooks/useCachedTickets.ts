
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, PaymentMethod } from '@/lib/types';

export const useCachedTickets = (status?: string, limit: number = 100) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('tickets')
          .select('*, customers(name, phone)')
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (status) {
          query = query.eq('status', status);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;

        // Transform the data to match our Ticket interface
        const transformedTickets: Ticket[] = data.map(ticket => ({
          id: ticket.id,
          ticketNumber: ticket.ticket_number || '000',
          clientName: ticket.customers?.name || 'Cliente',
          phoneNumber: ticket.customers?.phone || '',
          totalPrice: ticket.total || 0,
          paymentMethod: mapPaymentMethod(ticket.payment_method),
          status: ticket.status || 'pending',
          isPaid: ticket.is_paid || false,
          valetQuantity: ticket.valet_quantity || 0,
          createdAt: ticket.created_at,
          deliveredDate: ticket.delivered_date
        }));

        setTickets(transformedTickets);
        setError(null);
        
      } catch (err) {
        console.error('Error loading tickets:', err);
        setError(err instanceof Error ? err : new Error('Error loading tickets'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [status, limit]);
  
  return { tickets, loading, error };
};

// Helper function to map payment method strings to the PaymentMethod type
function mapPaymentMethod(method: string | null): PaymentMethod {
  if (!method) return 'cash';
  
  switch(method) {
    case 'cash': return 'cash';
    case 'debit': return 'debit';
    case 'mercadopago': return 'mercadopago';
    case 'cuenta_dni': return 'cuenta_dni';
    default: return 'cash';
  }
}
