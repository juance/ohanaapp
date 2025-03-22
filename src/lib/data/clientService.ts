
import { supabase } from '@/integrations/supabase/client';
import { ClientVisit } from '../types';
import { getFromLocalStorage } from './coreUtils';
import { TICKETS_STORAGE_KEY } from './coreUtils';

// Client Visit Frequency
export const getClientVisitFrequency = async (): Promise<ClientVisit[]> => {
  try {
    // Get customer visit frequency
    const { data, error } = await supabase
      .from('tickets')
      .select('customers(name, phone), created_at');
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    // Process the data to calculate visit frequency
    const clientVisits = new Map<string, { name: string; visits: string[]; lastVisit: string }>();
    
    data.forEach((ticket: any) => {
      if (!ticket.customers) return;
      
      const phoneNumber = ticket.customers.phone;
      const name = ticket.customers.name;
      const visitDate = ticket.created_at;
      
      if (clientVisits.has(phoneNumber)) {
        const client = clientVisits.get(phoneNumber)!;
        client.visits.push(visitDate);
        
        // Update last visit if newer
        if (new Date(visitDate) > new Date(client.lastVisit)) {
          client.lastVisit = visitDate;
        }
      } else {
        clientVisits.set(phoneNumber, {
          name,
          visits: [visitDate],
          lastVisit: visitDate
        });
      }
    });
    
    // Convert to array and sort by visit count
    const result: ClientVisit[] = Array.from(clientVisits.entries()).map(([phoneNumber, data]) => ({
      phoneNumber,
      clientName: data.name,
      visitCount: data.visits.length,
      lastVisit: data.lastVisit
    }));
    
    return result.sort((a, b) => b.visitCount - a.visitCount);
  } catch (error) {
    console.error('Error retrieving client visit frequency:', error);
    
    // Fallback calculation using localStorage
    try {
      const localTickets = getFromLocalStorage<any>(TICKETS_STORAGE_KEY);
      
      // Group by phone number
      const clientsMap = new Map<string, { name: string; visits: string[]; lastVisit: string }>();
      
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
            name: ticket.customerName,
            visits: [ticket.createdAt],
            lastVisit: ticket.createdAt
          });
        }
      });
      
      // Convert map to array and sort by visit count
      const result: ClientVisit[] = Array.from(clientsMap.entries()).map(([phoneNumber, data]) => ({
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
