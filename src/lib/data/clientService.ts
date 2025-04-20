
import { supabase } from '@/integrations/supabase/client';
import { ClientVisit } from '../types';
import { getFromLocalStorage } from './coreUtils';
import { TICKETS_STORAGE_KEY } from './coreUtils';

// Client Visit Frequency
export const getClientVisitFrequency = async (): Promise<ClientVisit[]> => {
  try {
    // Obtener directamente los datos de clientes con su contador de visitas
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, phone, valets_count, last_visit')
      .order('valets_count', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Convertir los datos al formato ClientVisit
    const result: ClientVisit[] = data.map(customer => ({
      id: customer.id,
      phoneNumber: customer.phone,
      clientName: customer.name,
      visitCount: customer.valets_count || 0,
      lastVisit: customer.last_visit
    }));

    return result;
  } catch (error) {
    console.error('Error retrieving client visit frequency:', error);

    // Fallback calculation using localStorage
    try {
      const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);

      // Group by phone number
      const clientsMap = new Map<string, { id: string; name: string; visits: string[]; lastVisit: string }>();

      localTickets.forEach((ticket: any) => {
        if (!ticket.phoneNumber) return;

        if (clientsMap.has(ticket.phoneNumber)) {
          const client = clientsMap.get(ticket.phoneNumber)!;
          client.visits.push(ticket.createdAt);

          // Update last visit if newer
          if (new Date(ticket.createdAt) > new Date(client.lastVisit)) {
            client.lastVisit = ticket.createdAt;
          }
        } else {
          clientsMap.set(ticket.phoneNumber, {
            id: ticket.id || ticket.phoneNumber, // Use ticketId or phoneNumber as fallback
            name: ticket.customerName,
            visits: [ticket.createdAt],
            lastVisit: ticket.createdAt
          });
        }
      });

      // Convert map to array and sort by visit count
      const result: ClientVisit[] = Array.from(clientsMap.entries()).map(([phoneNumber, data]) => ({
        id: data.id,
        phoneNumber,
        clientName: data.name,
        visitCount: data.visits.length,
        lastVisit: data.lastVisit
      }));

      return result.sort((a, b) => b.visitCount - a.visitCount);
    } catch (localError) {
      console.error('Error calculating client frequency from localStorage:', localError);
      return [];
    }
  }
};
