
import { supabase } from '@/integrations/supabase/client';
import { ClientVisit, Customer, Ticket, LaundryOption } from './types';

// Client functions
export const getCustomerByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      phone: data.phone, // For backwards compatibility
      lastVisit: data.last_visit,
      freeValets: data.free_valets,
      valetsCount: data.valets_count,
      valetsRedeemed: data.valets_redeemed,
      loyaltyPoints: data.loyalty_points,
      visitCount: data.valets_count || 0,
      visitFrequency: calculateFrequency(data.last_visit)
    };
  } catch (error) {
    console.error('Error fetching customer by phone:', error);
    return null;
  }
};

export const getAllClients = async (): Promise<ClientVisit[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('valets_count', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map(customer => ({
      id: customer.id,
      phoneNumber: customer.phone,
      clientName: customer.name,
      visitCount: customer.valets_count || 0,
      lastVisit: customer.last_visit || '',
      lastVisitDate: customer.last_visit || '', // For compatibility
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      loyaltyPoints: customer.loyalty_points || 0,
      visitFrequency: calculateFrequency(customer.last_visit)
    }));
  } catch (error) {
    console.error('Error fetching all clients:', error);
    return [];
  }
};

// Ticket functions
export const storeTicket = async (
  ticketData: Omit<Ticket, "id" | "ticketNumber" | "createdAt" | "clientName" | "phoneNumber" | "deliveredDate"> & { 
    customDate?: Date; 
    isPaidInAdvance?: boolean;
    usesFreeValet?: boolean;
  },
  customerData: {
    name: string;
    phoneNumber: string;
  },
  dryCleaningItems: any[] = [],
  laundryOptions: LaundryOption[] = []
): Promise<boolean> => {
  try {
    // Logic to store ticket...
    console.log('Storing ticket:', { ticketData, customerData, dryCleaningItems, laundryOptions });
    return true;
  } catch (error) {
    console.error('Error storing ticket:', error);
    return false;
  }
};

// Utility functions
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

// Get unretrieved tickets function
export const getUnretrievedTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'ready')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return [];

    return data.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.client_name,
      phoneNumber: ticket.phone_number,
      status: ticket.status,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      totalPrice: ticket.total_price || ticket.payment_amount || 0,
      paymentMethod: ticket.payment_method,
      valetQuantity: ticket.valet_quantity,
      isPaid: ticket.is_paid
    }));
  } catch (error) {
    console.error('Error fetching unretrieved tickets:', error);
    return [];
  }
};
