
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';

interface UnretrievedTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  createdAt: string;
  daysAgo: number;
}

const UnretrievedTicketsAlert = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ticketsOver45Days, setTicketsOver45Days] = useState<UnretrievedTicket[]>([]);
  const [ticketsOver90Days, setTicketsOver90Days] = useState<UnretrievedTicket[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUnretrievedTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const now = new Date();
      
      // Calculate dates for 45 and 90 days ago
      const date45DaysAgo = new Date();
      date45DaysAgo.setDate(now.getDate() - 45);
      
      const date90DaysAgo = new Date();
      date90DaysAgo.setDate(now.getDate() - 90);
      
      // Get tickets that are ready (not delivered) and created more than 45 days ago
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          ticket_number,
          created_at,
          customers (name, phone)
        `)
        .eq('status', 'ready')
        .eq('is_canceled', false)
        .lt('created_at', date45DaysAgo.toISOString())
        .order('created_at');
      
      if (error) throw error;
      
      // Process the data
      const processedTickets = data.map((ticket: any) => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        clientName: ticket.customers?.name || 'Cliente desconocido',
        createdAt: ticket.created_at,
        daysAgo: Math.floor((now.getTime() - new Date(ticket.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }));
      
      // Split into two categories based on days
      const over90Days = processedTickets.filter(ticket => ticket.daysAgo >= 90);
      const between45And90Days = processedTickets.filter(ticket => ticket.daysAgo >= 45 && ticket.daysAgo < 90);
      
      setTicketsOver90Days(over90Days);
      setTicketsOver45Days(between45And90Days);
      
    } catch (err) {
      console.error('Error fetching unretrieved tickets:', err);
      setError('Error al obtener los tickets sin retirar. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUnretrievedTickets();
    toast({
      title: "Éxito",
      description: "Datos de tickets actualizados correctamente"
    });
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUnretrievedTickets();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Alertas de Tickets No Retirados</h2>
        <Button 
          onClick={handleRefresh} 
          disabled={loading || refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar Datos
        </Button>
      </div>
      
      <p className="text-gray-500">
        Tickets que no han sido retirados por los clientes después de 45 y 90 días
      </p>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loading />
          <span className="ml-2">Cargando datos...</span>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Tickets sin retirar por más de 45 días
              </CardTitle>
              <CardDescription>
                Tickets que llevan entre 45 y 90 días sin ser retirados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ticketsOver45Days.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
                  No hay tickets sin retirar desde hace 45 días.
                </div>
              ) : (
                <div className="space-y-4">
                  {ticketsOver45Days.map(ticket => (
                    <Alert key={ticket.id} className="border-yellow-200 bg-yellow-50">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <AlertTitle className="font-medium">
                        Ticket #{ticket.ticketNumber} - {ticket.clientName}
                      </AlertTitle>
                      <AlertDescription>
                        Sin retirar desde hace {ticket.daysAgo} días (creado el {new Date(ticket.createdAt).toLocaleDateString()})
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Tickets sin retirar por más de 90 días (prendas a donar)
              </CardTitle>
              <CardDescription>
                Tickets que llevan más de 90 días sin ser retirados y pueden ser donados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ticketsOver90Days.length === 0 ? (
                <div className="py-4 text-center text-gray-500">
                  No hay tickets sin retirar desde hace 90 días.
                </div>
              ) : (
                <div className="space-y-4">
                  {ticketsOver90Days.map(ticket => (
                    <Alert key={ticket.id} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="font-medium">
                        Ticket #{ticket.ticketNumber} - {ticket.clientName}
                      </AlertTitle>
                      <AlertDescription>
                        Sin retirar desde hace {ticket.daysAgo} días (creado el {new Date(ticket.createdAt).toLocaleDateString()})
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default UnretrievedTicketsAlert;
