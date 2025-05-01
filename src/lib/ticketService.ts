
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';
import { 
  isInStatus, 
  getDatabaseStatuses, 
  getStatusDisplayName, 
  getStatusBadgeClass 
} from './ticket/ticketStatusService';

// Get tickets that are ready for pickup
export const getReadyTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers(name, phone)')
      .eq('status', 'ready')
      .order('created_at', { ascending: false });
      
    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number || '000',
      clientName: ticket.customers?.name || 'Cliente',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'ready',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: null
    }));
  } catch (error) {
    console.error('Error fetching ready tickets:', error);
    toast.error('Error al cargar los tickets listos para entrega');
    return [];
  }
};

// Get delivered tickets
export const getDeliveredTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers(name, phone)')
      .eq('status', 'delivered')
      .order('created_at', { ascending: false });
      
    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number || '000',
      clientName: ticket.customers?.name || 'Cliente',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'delivered',
      isPaid: ticket.is_paid || true,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date
    }));
  } catch (error) {
    console.error('Error fetching delivered tickets:', error);
    toast.error('Error al cargar los tickets entregados');
    return [];
  }
};

// Get services for a specific ticket
export const getTicketServices = async (ticketId: string): Promise<any[]> => {
  try {
    // Get dry cleaning items
    const { data: dryCleaningItems, error: dryCleaningError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
      
    if (dryCleaningError) throw dryCleaningError;
    
    // Get laundry options
    const { data: laundryOptions, error: laundryError } = await supabase
      .from('ticket_laundry_options')
      .select('*')
      .eq('ticket_id', ticketId);
      
    if (laundryError) throw laundryError;
    
    // Combine and return services
    const services = [
      ...(dryCleaningItems || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        quantity: item.quantity || 1,
        type: 'dry_cleaning'
      })),
      ...(laundryOptions || []).map(option => ({
        id: option.id,
        name: option.option_type,
        price: 0,
        quantity: 1,
        type: 'laundry_option'
      }))
    ];
    
    return services;
  } catch (error) {
    console.error('Error fetching ticket services:', error);
    toast.error('Error al cargar los servicios del ticket');
    return [];
  }
};

// Mark a ticket as delivered
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        delivered_date: now,
        is_paid: true,
        updated_at: now
      })
      .eq('id', ticketId);
      
    if (error) throw error;
    
    toast.success('Ticket marcado como entregado');
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    toast.error('Error al marcar el ticket como entregado');
    return false;
  }
};

// Get tickets that haven't been retrieved (ready but not delivered)
export const getUnretrievedTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers(name, phone)')
      .eq('status', 'ready')
      .order('created_at', { ascending: false });
      
    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number || '000',
      clientName: ticket.customers?.name || 'Cliente',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'ready',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: null
    }));
  } catch (error) {
    console.error('Error fetching unretrieved tickets:', error);
    toast.error('Error al cargar los tickets pendientes por retirar');
    return [];
  }
};

// Re-export useful functions from ticketStatusService
export {
  isInStatus,
  getDatabaseStatuses,
  getStatusDisplayName,
  getStatusBadgeClass
};
