
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/lib/toast';

interface CustomerData {
  id: string;
  name: string;
  phoneNumber: string;
  totalOrders: number;
  loyaltyPoints: number;
  freeValets: number;
  lastVisit?: string;
}

interface CustomerTicket {
  id: string;
  ticketNumber: string;
  status: string;
  total: number;
  date: string;
  deliveredDate?: string;
  services: any[];
}

export const useCustomerPortal = () => {
  const [searchedPhone, setSearchedPhone] = useState('');
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  // Query para obtener tickets del cliente
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['customerTickets', searchedPhone],
    queryFn: async () => {
      if (!searchedPhone) return [];
      
      // Buscar tickets en localStorage por teléfono
      const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      return allTickets.filter((ticket: any) => 
        ticket.phoneNumber === searchedPhone
      );
    },
    enabled: !!searchedPhone
  });

  const searchCustomer = useCallback(async (phoneNumber: string) => {
    try {
      setSearchedPhone(phoneNumber);
      
      // Buscar datos del cliente en localStorage
      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const customer = customers.find((c: any) => c.phoneNumber === phoneNumber);
      
      if (customer) {
        // Calcular estadísticas del cliente
        const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
        const customerTickets = allTickets.filter((ticket: any) => 
          ticket.phoneNumber === phoneNumber
        );
        
        const customerStats: CustomerData = {
          id: customer.id,
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          totalOrders: customerTickets.length,
          loyaltyPoints: customer.loyaltyPoints || 0,
          freeValets: customer.freeValets || 0,
          lastVisit: customer.lastVisit
        };
        
        setCustomerData(customerStats);
        toast.success(`Bienvenido, ${customer.name}`);
      } else {
        setCustomerData(null);
        toast.error('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error searching customer:', error);
      toast.error('Error al buscar cliente');
    }
  }, []);

  const sendNotification = useCallback(async (ticketId: string) => {
    try {
      // Simular envío de notificación
      toast.success('Notificación enviada al cliente');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error al enviar notificación');
    }
  }, []);

  return {
    customerData,
    tickets: tickets as CustomerTicket[],
    isLoading: ticketsLoading,
    searchCustomer,
    sendNotification
  };
};
