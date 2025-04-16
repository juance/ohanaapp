
import { supabase } from '@/integrations/supabase/client';
import { GenericStringError } from '@/lib/types/error.types';
import { Ticket } from '@/lib/types/ticket.types';
import { ensureSupabaseSession } from '@/lib/auth/supabaseAuth';
import { toast } from '@/lib/toast';

export const markTicketAsDelivered = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        delivered_date: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error updating ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return data;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

export const markTicketAsPending = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        status: 'pending',
        delivered_date: null
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error updating ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return data;
  } catch (error) {
    console.error('Error marking ticket as pending:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

export const updateTicketStatus = async (ticketId: string, newStatus: string) => {
  try {
    const validStatuses = ['pending', 'ready', 'delivered', 'canceled'];
    if (!validStatuses.includes(newStatus)) {
      return {
        message: `Estado no válido: ${newStatus}`
      };
    }

    const { error } = await supabase
      .from('tickets')
      .update({
        status: newStatus,
        delivered_date: newStatus === 'delivered' ? new Date().toISOString() : null
      })
      .eq('id', ticketId);

    if (error) {
      throw {
        message: `Error al actualizar el ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return {
      message: `Ticket actualizado a estado: ${newStatus}`,
      id: ticketId
    };
  } catch (error) {
    console.error('Error updating ticket status:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

/**
 * Mapea los tickets con los clientes relacionados (cuando se usa la relación)
 */
const mapTicketsWithRelatedCustomers = (tickets: any[]): Ticket[] => {
  console.log('Mapeando tickets con clientes relacionados');
  return tickets.map(ticket => {
    try {
      // Obtener la información del cliente desde la relación
      const customerId = ticket.customer_id;
      const customerName = ticket.customers?.name || 'Cliente sin nombre';
      const customerPhone = ticket.customers?.phone || '';

      console.log('Mapeando ticket con cliente relacionado:', {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        customer_id: customerId,
        customerName,
        customerPhone
      });

      return {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        basketTicketNumber: ticket.basket_ticket_number,
        clientName: customerName,
        phoneNumber: customerPhone,
        totalPrice: parseFloat(ticket.total) || 0,
        paymentMethod: ticket.payment_method,
        status: ticket.status,
        isPaid: ticket.is_paid,
        valetQuantity: ticket.valet_quantity,
        createdAt: ticket.created_at,
        deliveredDate: ticket.delivered_date,
        customerId: customerId,
        // Incluir los servicios de tintorería si están disponibles
        dryCleaningItems: ticket.dry_cleaning_items || []
      };
    } catch (error) {
      console.error('Error mapping ticket with related customer:', error);
      return {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        basketTicketNumber: ticket.basket_ticket_number,
        clientName: 'Error al obtener cliente',
        phoneNumber: '',
        totalPrice: parseFloat(ticket.total) || 0,
        paymentMethod: ticket.payment_method,
        status: ticket.status,
        isPaid: ticket.is_paid,
        valetQuantity: ticket.valet_quantity,
        createdAt: ticket.created_at,
        deliveredDate: ticket.delivered_date,
        customerId: ticket.customer_id,
        // Incluir los servicios de tintorería si están disponibles
        dryCleaningItems: ticket.dry_cleaning_items || []
      };
    }
  });
};

export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    console.log('Fetching pickup tickets...');

    // Verificar la conexión con Supabase
    const connectionActive = await ensureSupabaseSession();
    if (!connectionActive) {
      console.error('No se pudo establecer conexión con Supabase');
      toast.error('Error de conexión con el servidor');
      return [];
    }

    // First, check if there are any tickets with status 'ready' and not canceled
    const { count, error: countError } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ready')
      .eq('is_canceled', false);

    console.log('Count of ready tickets:', count);

    if (countError) {
      console.error('Error counting tickets:', countError);
      throw countError;
    }

    if (count === 0) {
      console.log('No tickets found with status ready and not canceled');
      return [];
    }

    // Obtener los tickets directamente sin intentar usar la relación primero
    // Esto garantiza que siempre obtendremos los tickets, incluso si hay problemas con la relación
    console.log('Obteniendo tickets con status "ready" y no cancelados...');
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        dry_cleaning_items (*)
      `)
      .eq('status', 'ready')
      .eq('is_canceled', false)
      .order('created_at', { ascending: false });

    // Imprimir todos los tickets para depuración
    if (data && data.length > 0) {
      console.log('Tickets obtenidos:', data.map(t => ({ id: t.id, ticket_number: t.ticket_number, status: t.status })));
    }

    if (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }

    console.log('Fetched tickets:', data?.length || 0);
    console.log('First ticket data sample:', data && data.length > 0 ? {
      id: data[0].id,
      ticket_number: data[0].ticket_number,
      customer_id: data[0].customer_id
    } : 'No tickets');

    if (!data || data.length === 0) {
      console.log('No tickets returned from query');
      return [];
    }

    // Obtener los IDs de los clientes de los tickets
    const customerIds = data.map(ticket => ticket.customer_id).filter(Boolean);

    // Obtener los datos de los clientes
    let customers = [];
    if (customerIds.length > 0) {
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, name, phone')
        .in('id', customerIds);

      if (customersError) {
        console.error('Error fetching customers:', customersError);
      } else {
        customers = customersData || [];
      }
    }

    console.log('Fetched customers:', customers.length);

    // Map the tickets to the application format
    const mappedTickets = data.map(ticket => {
      try {
        // Buscar el cliente correspondiente al ticket
        const customerId = ticket.customer_id;
        const customer = customers.find(c => c.id === customerId);
        const customerName = customer?.name || 'Cliente sin nombre';
        const customerPhone = customer?.phone || '';

        console.log('Mapping ticket:', {
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          customer_id: ticket.customer_id,
          customer_info: customer,
          customerName,
          customerPhone
        });

        // Crear un objeto limpio sin incluir todas las propiedades del ticket original
        return {
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          basketTicketNumber: ticket.basket_ticket_number,
          clientName: customerName,
          phoneNumber: customerPhone,
          totalPrice: parseFloat(ticket.total) || 0,
          paymentMethod: ticket.payment_method,
          status: ticket.status,
          isPaid: ticket.is_paid,
          valetQuantity: ticket.valet_quantity,
          createdAt: ticket.created_at,
          deliveredDate: ticket.delivered_date,
          customerId: customerId,
          // Incluir los servicios de tintorería si están disponibles
          dryCleaningItems: ticket.dry_cleaning_items || []
        };
      } catch (mapError) {
        console.error('Error mapping ticket:', mapError, ticket);
        return null;
      }
    }).filter(Boolean) as Ticket[];

    console.log('Mapped tickets:', mappedTickets.length);
    return mappedTickets;
  } catch (error) {
    console.error('Error getting pickup tickets:', error);
    return [];
  }
};

export const getUnretrievedTickets = async (days: number): Promise<Ticket[]> => {
  try {
    const now = new Date();
    const dateXDaysAgo = new Date(now);
    dateXDaysAgo.setDate(now.getDate() - days);

    // Intentar usar la relación con los clientes si existe
    try {
      const { data: relatedData, error: relatedError } = await supabase
        .from('tickets')
        .select(`
          *,
          customers(id, name, phone),
          dry_cleaning_items (*)
        `)
        .eq('status', 'ready')
        .eq('is_canceled', false)
        .lt('created_at', dateXDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!relatedError && relatedData) {
        console.log(`Usando relación con clientes para tickets no recogidos después de ${days} días:`, relatedData.length);
        return mapTicketsWithRelatedCustomers(relatedData);
      }

      console.log(`No se pudo usar la relación con clientes para tickets no recogidos después de ${days} días, usando método alternativo`);
    } catch (relatedError) {
      console.log(`Error al intentar usar la relación con clientes para tickets no recogidos después de ${days} días:`, relatedError);
    }

    // Método alternativo: obtener los tickets sin usar la relación
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        dry_cleaning_items (*)
      `)
      .eq('status', 'ready')
      .eq('is_canceled', false)
      .lt('created_at', dateXDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Obtener los IDs de los clientes de los tickets
    const customerIds = data.map(ticket => ticket.customer_id).filter(Boolean);

    // Obtener los datos de los clientes
    let customers = [];
    if (customerIds.length > 0) {
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, name, phone')
        .in('id', customerIds);

      if (customersError) {
        console.error('Error fetching customers for unretrieved tickets:', customersError);
      } else {
        customers = customersData || [];
      }
    }

    return (data || []).map(ticket => {
      // Buscar el cliente correspondiente al ticket
      const customerId = ticket.customer_id;
      const customer = customers.find(c => c.id === customerId);
      const customerName = customer?.name || 'Cliente sin nombre';
      const customerPhone = customer?.phone || '';

      return {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        basketTicketNumber: ticket.basket_ticket_number,
        clientName: customerName,
        phoneNumber: customerPhone,
        totalPrice: parseFloat(ticket.total) || 0,
        paymentMethod: ticket.payment_method,
        status: ticket.status,
        isPaid: ticket.is_paid,
        valetQuantity: ticket.valet_quantity,
        createdAt: ticket.created_at,
        deliveredDate: ticket.delivered_date,
        customerId: ticket.customer_id,
        // Incluir los servicios de tintorería si están disponibles
        dryCleaningItems: ticket.dry_cleaning_items || []
      };
    });
  } catch (error) {
    console.error(`Error getting unretrieved tickets after ${days} days:`, error);
    return [];
  }
};

export const cancelTicket = async (ticketId: string, reason?: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        status: 'canceled',
        is_canceled: true,
        cancel_reason: reason || 'No reason provided'
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw {
        message: `Error canceling ticket: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    return data;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};

/**
 * Update the payment method of a ticket
 * @param ticketId The ID of the ticket to update
 * @param paymentMethod The new payment method
 * @returns The updated ticket data
 */
export const updateTicketPaymentMethod = async (ticketId: string, paymentMethod: string) => {
  try {
    console.log(`Updating payment method for ticket ${ticketId} to ${paymentMethod}`);

    const { data, error } = await supabase
      .from('tickets')
      .update({
        payment_method: paymentMethod,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment method:', error);
      throw {
        message: `Error updating payment method: ${error.message}`,
        id: ticketId
      } as GenericStringError;
    }

    console.log('Payment method updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    if (error instanceof Error) {
      throw {
        message: error.message,
        id: ticketId
      } as GenericStringError;
    }
    throw error;
  }
};
