
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  hasActiveOrder: boolean;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

interface SentMessage {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  content: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export const useWhatsAppIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Query para obtener clientes
  const { data: customers = [] } = useQuery({
    queryKey: ['whatsappCustomers'],
    queryFn: async () => {
      const allCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
      const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      
      return allCustomers.map((customer: any) => ({
        ...customer,
        hasActiveOrder: allTickets.some((ticket: any) => 
          ticket.phoneNumber === customer.phoneNumber && 
          ['pending', 'ready'].includes(ticket.status)
        )
      }));
    }
  });

  // Plantillas de mensajes predefinidas
  const messageTemplates: MessageTemplate[] = [
    {
      id: '1',
      name: 'Orden Lista',
      content: 'Hola {nombre}, tu orden #{numero} está lista para recoger. ¡Te esperamos!',
      category: 'notification'
    },
    {
      id: '2',
      name: 'Recordatorio',
      content: 'Hola {nombre}, recuerda que tienes una orden pendiente de recoger. Estamos abiertos hasta las 18:00.',
      category: 'reminder'
    },
    {
      id: '3',
      name: 'Promoción',
      content: '🎉 ¡Oferta especial! 20% de descuento en servicios de tintorería. Válido hasta fin de mes.',
      category: 'promotion'
    },
    {
      id: '4',
      name: 'Confirmación',
      content: 'Hola {nombre}, confirmamos que recibimos tu orden. Te notificaremos cuando esté lista.',
      category: 'confirmation'
    }
  ];

  // Query para mensajes enviados
  const { data: sentMessages = [] } = useQuery({
    queryKey: ['sentMessages'],
    queryFn: async () => {
      return JSON.parse(localStorage.getItem('sentMessages') || '[]');
    }
  });

  const sendMessage = useCallback(async (customerId: string, content: string) => {
    setIsLoading(true);
    try {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) throw new Error('Cliente no encontrado');

      // Simular envío de mensaje (en un sistema real se integraría con WhatsApp Business API)
      const newMessage: SentMessage = {
        id: Date.now().toString() + Math.random(),
        customerId,
        customerName: customer.name,
        phoneNumber: customer.phoneNumber,
        content,
        sentAt: new Date().toISOString(),
        status: 'sent'
      };

      const existingMessages = JSON.parse(localStorage.getItem('sentMessages') || '[]');
      const updatedMessages = [...existingMessages, newMessage];
      localStorage.setItem('sentMessages', JSON.stringify(updatedMessages));

      queryClient.invalidateQueries({ queryKey: ['sentMessages'] });
      
      toast.success(`Mensaje enviado a ${customer.name}`);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  }, [customers, queryClient]);

  const scheduleMessage = useCallback(async (customerIds: string[], content: string, scheduledDate: string) => {
    try {
      // Simular programación de mensaje
      const scheduledMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]');
      
      customerIds.forEach(customerId => {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
          scheduledMessages.push({
            id: Date.now().toString() + Math.random(),
            customerId,
            customerName: customer.name,
            phoneNumber: customer.phoneNumber,
            content,
            scheduledFor: scheduledDate,
            status: 'scheduled'
          });
        }
      });

      localStorage.setItem('scheduledMessages', JSON.stringify(scheduledMessages));
      toast.success(`Mensaje programado para ${customerIds.length} cliente(s)`);
    } catch (error) {
      console.error('Error scheduling message:', error);
      toast.error('Error al programar mensaje');
    }
  }, [customers]);

  const createTemplate = useCallback(async (name: string, content: string, category: string) => {
    try {
      const templates = JSON.parse(localStorage.getItem('messageTemplates') || '[]');
      const newTemplate: MessageTemplate = {
        id: Date.now().toString(),
        name,
        content,
        category
      };
      
      templates.push(newTemplate);
      localStorage.setItem('messageTemplates', JSON.stringify(templates));
      
      toast.success('Plantilla creada exitosamente');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Error al crear plantilla');
    }
  }, []);

  return {
    customers,
    messageTemplates,
    sentMessages,
    sendMessage,
    scheduleMessage,
    createTemplate,
    isLoading
  };
};
