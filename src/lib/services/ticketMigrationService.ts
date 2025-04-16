import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Servicio para migrar y corregir tickets sin servicios
 */

/**
 * Crea servicios por defecto para tickets que no tienen servicios
 * @param ticketId ID del ticket
 * @param valetQuantity Cantidad de valets (opcional)
 * @returns true si se crearon servicios, false en caso contrario
 */
export const createDefaultServicesForTicket = async (ticketId: string, valetQuantity?: number): Promise<boolean> => {
  try {
    console.log(`Creando servicios por defecto para ticket ${ticketId}`);
    
    // Verificar si el ticket ya tiene servicios
    const { data: existingServices, error: checkError } = await supabase
      .from('dry_cleaning_items')
      .select('id')
      .eq('ticket_id', ticketId);
      
    if (checkError) {
      console.error('Error al verificar servicios existentes:', checkError);
      return false;
    }
    
    // Si ya tiene servicios, no hacer nada
    if (existingServices && existingServices.length > 0) {
      console.log(`El ticket ${ticketId} ya tiene ${existingServices.length} servicios, no se crearán nuevos`);
      return true;
    }
    
    // Obtener información del ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('total, valet_quantity')
      .eq('id', ticketId)
      .single();
      
    if (ticketError) {
      console.error('Error al obtener información del ticket:', ticketError);
      return false;
    }
    
    // Usar la cantidad de valets del ticket si no se proporciona
    const quantity = valetQuantity || ticket.valet_quantity || 1;
    const price = ticket.total / quantity;
    
    // Crear un servicio por defecto
    const { data: newService, error: insertError } = await supabase
      .from('dry_cleaning_items')
      .insert({
        ticket_id: ticketId,
        name: quantity > 1 ? 'Valets' : 'Valet',
        quantity: quantity,
        price: price
      })
      .select();
      
    if (insertError) {
      console.error('Error al crear servicio por defecto:', insertError);
      return false;
    }
    
    console.log(`Servicio por defecto creado para ticket ${ticketId}:`, newService);
    return true;
  } catch (error) {
    console.error('Error en createDefaultServicesForTicket:', error);
    return false;
  }
};

/**
 * Migra todos los tickets sin servicios
 * @returns Número de tickets migrados
 */
export const migrateAllTicketsWithoutServices = async (): Promise<number> => {
  try {
    console.log('Iniciando migración de tickets sin servicios...');
    
    // Obtener todos los tickets
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('id, ticket_number, valet_quantity')
      .eq('is_canceled', false);
      
    if (ticketsError) {
      console.error('Error al obtener tickets:', ticketsError);
      return 0;
    }
    
    console.log(`Se encontraron ${tickets.length} tickets para verificar`);
    
    let migratedCount = 0;
    
    // Para cada ticket, verificar si tiene servicios
    for (const ticket of tickets) {
      const { data: services, error: servicesError } = await supabase
        .from('dry_cleaning_items')
        .select('id')
        .eq('ticket_id', ticket.id);
        
      if (servicesError) {
        console.error(`Error al verificar servicios para ticket ${ticket.id}:`, servicesError);
        continue;
      }
      
      // Si no tiene servicios, crear uno por defecto
      if (!services || services.length === 0) {
        console.log(`Ticket ${ticket.ticket_number} (${ticket.id}) no tiene servicios, creando servicio por defecto...`);
        const success = await createDefaultServicesForTicket(ticket.id, ticket.valet_quantity);
        if (success) {
          migratedCount++;
        }
      }
    }
    
    console.log(`Migración completada. Se migraron ${migratedCount} tickets.`);
    return migratedCount;
  } catch (error) {
    console.error('Error en migrateAllTicketsWithoutServices:', error);
    return 0;
  }
};

/**
 * Verifica y corrige un ticket específico
 * @param ticketNumber Número de ticket
 * @returns true si se corrigió el ticket, false en caso contrario
 */
export const fixTicketByNumber = async (ticketNumber: string): Promise<boolean> => {
  try {
    console.log(`Verificando ticket #${ticketNumber}...`);
    
    // Obtener el ticket por número
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, valet_quantity')
      .eq('ticket_number', ticketNumber)
      .single();
      
    if (ticketError) {
      console.error(`Error al obtener ticket #${ticketNumber}:`, ticketError);
      return false;
    }
    
    if (!ticket) {
      console.error(`No se encontró el ticket #${ticketNumber}`);
      return false;
    }
    
    // Verificar si tiene servicios
    const { data: services, error: servicesError } = await supabase
      .from('dry_cleaning_items')
      .select('id')
      .eq('ticket_id', ticket.id);
      
    if (servicesError) {
      console.error(`Error al verificar servicios para ticket #${ticketNumber}:`, servicesError);
      return false;
    }
    
    // Si no tiene servicios, crear uno por defecto
    if (!services || services.length === 0) {
      console.log(`Ticket #${ticketNumber} no tiene servicios, creando servicio por defecto...`);
      return await createDefaultServicesForTicket(ticket.id, ticket.valet_quantity);
    } else {
      console.log(`Ticket #${ticketNumber} ya tiene ${services.length} servicios, no se requiere corrección`);
      return true;
    }
  } catch (error) {
    console.error(`Error en fixTicketByNumber para ticket #${ticketNumber}:`, error);
    return false;
  }
};
