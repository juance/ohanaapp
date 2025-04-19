import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, MessageCircle } from "lucide-react";
import { toast } from "@/lib/toast";
import { useQuery } from '@tanstack/react-query';
import { getUnretrievedTickets } from '@/lib/ticket/ticketPickupService';
import { Ticket } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const UnretrievedTickets = () => {
  const [activeTab, setActiveTab] = useState<'45days' | '90days'>('45days');

  const { data: unretrievedTickets45, isLoading: isLoading45 } = useQuery({
    queryKey: ['unretrievedTickets', 45],
    queryFn: () => getUnretrievedTickets(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: unretrievedTickets90, isLoading: isLoading90 } = useQuery({
    queryKey: ['unretrievedTickets', 90],
    queryFn: () => getUnretrievedTickets(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleNotifyClient = (ticket: Ticket) => {
    if (ticket) {
      let message = '';
      
      if (activeTab === '45days') {
        message = encodeURIComponent(
          `Hola ${ticket.clientName}, le recordamos que su pedido está listo para retirar en Lavandería Ohana desde hace más de 45 días.`
        );
      } else {
        message = encodeURIComponent(
          `Hola ${ticket.clientName}, le recordamos que su pedido está listo para retirar en Lavandería Ohana desde hace más de 90 días. Si no es retirado pronto, será donado a caridad.`
        );
      }
      
      const whatsappUrl = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');

      toast.success(`Notificación enviada a ${ticket.clientName}`, {
        description: `Se notificó sobre su pedido pendiente de retiro.`
      });
    } else {
      toast.error('Error al enviar la notificación');
    }
  };

  const renderTicketList = (tickets: Ticket[] | undefined, isLoading: boolean, days: number) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Clock className="animate-spin h-6 w-6 mr-2" />
          <span>Cargando tickets...</span>
        </div>
      );
    }

    if (!tickets || tickets.length === 0) {
      return (
        <div className="bg-yellow-50 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No hay tickets sin retirar desde hace {days} días.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">#{ticket.ticketNumber}</span>
                <span className="text-gray-600">{ticket.clientName}</span>
                <Badge variant={days === 90 ? "destructive" : "secondary"}>
                  {days === 90 ? "Donación pendiente" : "Sin retirar"}
                </Badge>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <span>Tel: {ticket.phoneNumber}</span>
                <span className="mx-2">•</span>
                <span>
                  Creado: {format(new Date(ticket.createdAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => handleNotifyClient(ticket)}
            >
              <MessageCircle className="h-4 w-4" />
              Notificar
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Alertas de Tickets No Retirados
        </CardTitle>
        <CardDescription>
          Tickets que no han sido retirados por los clientes después de 45 y 90 días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === '45days' ? "default" : "outline"}
            onClick={() => setActiveTab('45days')}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Tickets sin retirar por más de 45 días
          </Button>
          <Button
            variant={activeTab === '90days' ? "default" : "outline"}
            onClick={() => setActiveTab('90days')}
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Tickets sin retirar por más de 90 días (prendas a donar)
          </Button>
        </div>

        {activeTab === '45days' && renderTicketList(unretrievedTickets45, isLoading45, 45)}
        {activeTab === '90days' && renderTicketList(unretrievedTickets90, isLoading90, 90)}
      </CardContent>
    </Card>
  );
};
