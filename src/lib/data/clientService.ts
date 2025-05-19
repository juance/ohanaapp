
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
      .select('id, name, phone, valets_count, last_visit, free_valets, loyalty_points')
      .order('valets_count', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Convertir los datos al formato ClientVisit
    const result: ClientVisit[] = data.map(customer => ({
      id: customer.id,
      customerId: customer.id,
      customerName: customer.name || '',
      phoneNumber: customer.phone,
      clientName: customer.name,
      visitCount: customer.valets_count || 0,
      lastVisitDate: customer.last_visit || '',
      lastVisit: customer.last_visit || '',
      visitDate: customer.last_visit || '',
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      loyaltyPoints: customer.loyalty_points || 0,
      visitFrequency: calculateFrequency(customer.last_visit),
      total: 0, // Default value for compatibility
      isPaid: false // Default value for compatibility
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
            name: ticket.customerName || ticket.clientName,
            visits: [ticket.createdAt],
            lastVisit: ticket.createdAt
          });
        }
      });

      // Convert map to array and sort by visit count
      const result: ClientVisit[] = Array.from(clientsMap.entries()).map(([phoneNumber, data]) => ({
        id: data.id,
        customerId: data.id,
        customerName: data.name || '',
        phoneNumber,
        clientName: data.name,
        visitCount: data.visits.length,
        lastVisit: data.lastVisit,
        lastVisitDate: data.lastVisit,
        visitDate: data.lastVisit,
        valetsCount: data.visits.length,
        freeValets: Math.floor(data.visits.length / 9),
        loyaltyPoints: data.visits.length * 10,
        visitFrequency: calculateFrequency(data.lastVisit),
        total: 0,
        isPaid: false
      }));

      return result.sort((a, b) => b.visitCount - a.visitCount);
    } catch (localError) {
      console.error('Error calculating client frequency from localStorage:', localError);
      return [];
    }
  }
};

// Helper function to calculate visit frequency based on last visit date
const calculateFrequency = (lastVisit: string | null): string => {
  if (!lastVisit) return 'N/A';
  
  const lastVisitDate = new Date(lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 'Semanal';
  if (diffDays <= 30) return 'Mensual';
  if (diffDays <= 90) return 'Trimestral';
  return 'Ocasional';
};
