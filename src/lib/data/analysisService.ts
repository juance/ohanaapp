
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
    return customers.map(customer => ({
      id: customer.id,
      clientId: customer.id,
      clientName: customer.name || 'Cliente sin nombre',
      phoneNumber: customer.phone || '',
      visitCount: customer.valets_count || 0,
      lastVisit: customer.last_visit || customer.created_at,
      loyaltyPoints: customer.loyalty_points || 0,
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      visitFrequency: customer.valets_count >= 10 ? 'Frecuente' : 
                     customer.valets_count >= 5 ? 'Regular' : 'Ocasional'
    }));
  } catch (error) {
    console.error('Error getting client visit frequency:', error);
    throw error;
  }
};
