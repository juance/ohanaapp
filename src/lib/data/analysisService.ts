
import { ClientVisit, Ticket } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Analyze ticket data for insights
 * @returns Analysis of tickets
 */
export const analyzeTickets = async (): Promise<any> => {
  try {
    // Get all tickets from Supabase
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate basic stats
    const totalTickets = tickets.length;
    const deliveredTickets = tickets.filter(t => t.status === 'delivered').length;
    const pendingTickets = totalTickets - deliveredTickets;
    const revenue = tickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);

    // Calculate tickets by day of week
    const dayOfWeekCounts = Array(7).fill(0);
    tickets.forEach(ticket => {
      const date = new Date(ticket.created_at);
      const dayOfWeek = date.getDay();
      dayOfWeekCounts[dayOfWeek]++;
    });

    return {
      totalTickets,
      deliveredTickets,
      pendingTickets,
      revenue,
      ticketsByDayOfWeek: dayOfWeekCounts
    };
  } catch (error) {
    console.error('Error analyzing tickets:', error);
    throw error;
  }
};

/**
 * Analyze customer data for insights
 * @returns Analysis of customers
 */
export const analyzeCustomers = async (): Promise<any> => {
  try {
    // Get all customers from Supabase
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('last_visit', { ascending: false });

    if (error) throw error;

    // Calculate basic stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.last_visit && new Date(c.last_visit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
    const loyalCustomers = customers.filter(c => (c.valets_count || 0) > 5).length;

    return {
      totalCustomers,
      activeCustomers,
      loyalCustomers
    };
  } catch (error) {
    console.error('Error analyzing customers:', error);
    throw error;
  }
};

/**
 * Analyze revenue data for insights
 * @returns Analysis of revenue
 */
export const analyzeRevenue = async (): Promise<any> => {
  try {
    // Get all tickets from Supabase for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate revenue by day
    const revenueByDay: Record<string, number> = {};
    tickets.forEach(ticket => {
      const date = new Date(ticket.created_at).toISOString().split('T')[0];
      if (!revenueByDay[date]) {
        revenueByDay[date] = 0;
      }
      revenueByDay[date] += ticket.total || 0;
    });

    // Calculate payment methods distribution
    const paymentMethods = {
      cash: 0,
      debit: 0,
      mercadopago: 0,
      cuenta_dni: 0,
      other: 0
    };

    tickets.forEach(ticket => {
      if (ticket.payment_method === 'cash') paymentMethods.cash++;
      else if (ticket.payment_method === 'debit') paymentMethods.debit++;
      else if (ticket.payment_method === 'mercadopago') paymentMethods.mercadopago++;
      else if (ticket.payment_method === 'cuenta_dni') paymentMethods.cuenta_dni++;
      else paymentMethods.other++;
    });

    return {
      revenueByDay,
      paymentMethods,
      totalRevenue: tickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0),
      ticketsCount: tickets.length
    };
  } catch (error) {
    console.error('Error analyzing revenue:', error);
    throw error;
  }
};

/**
 * Get client visit frequency data
 * @returns ClientVisit array
 */
export const getClientVisitFrequency = async (): Promise<ClientVisit[]> => {
  try {
    // Get customer data with visit stats from Supabase
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('valets_count', { ascending: false });

    if (error) throw error;

    // Map to ClientVisit format
    return customers.map(client => ({
      id: client.id,
      clientId: client.id,
      customerId: client.id,
      clientName: client.name || 'Cliente sin nombre',
      customerName: client.name || 'Cliente sin nombre',
      phoneNumber: client.phone || '',
      visitCount: client.valets_count || 0,
      lastVisit: client.last_visit || client.created_at,
      lastVisitDate: client.last_visit || client.created_at,
      visitDate: client.last_visit || client.created_at,
      loyaltyPoints: client.loyalty_points || 0,
      valetsCount: client.valets_count || 0,
      freeValets: client.free_valets || 0,
      visitFrequency: client.valets_count >= 10 ? 'Frecuente' : 
                     client.valets_count >= 5 ? 'Regular' : 'Ocasional',
      total: 0,
      isPaid: false
    }));
  } catch (error) {
    console.error('Error getting client visit frequency:', error);
    throw error;
  }
};

// A function to calculate client frequency - Fixed async/await issue and property access
export const calculateClientFrequency = (visits: any[]): any[] => {
  try {
    // Process the visits data
    return visits.map(client => ({
      id: client.id,
      clientId: client.id,
      customerId: client.id,
      clientName: client.name,
      customerName: client.name,
      phoneNumber: client.phone || '',
      visitCount: client.valets_count || 0,
      lastVisit: client.last_visit || '',
      lastVisitDate: client.last_visit || '',
      visitDate: client.last_visit || '',
      loyaltyPoints: (client.valets_count || 0) * 10,
      valetsCount: client.valets_count || 0,
      freeValets: Math.floor((client.valets_count || 0) / 9),
      visitFrequency: calculateVisitFrequency(client.last_visit),
      total: 0,
      isPaid: false
    }));
  } catch (error) {
    console.error("Error calculating client frequency:", error);
    return [];
  }
};

// Helper function to calculate visit frequency
const calculateVisitFrequency = (lastVisit?: string): string => {
  if (!lastVisit) return 'N/A';
  
  const date = new Date(lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 'Reciente';
  else if (diffDays <= 30) return 'Mensual';
  else if (diffDays <= 90) return 'Bimestral';
  else return 'Anual';
};
