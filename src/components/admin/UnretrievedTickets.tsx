import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUnretrievedTickets } from '@/lib/ticketServices';
import { markTicketAsDelivered } from '@/lib/ticketServices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/lib/toast';

export interface TicketWithCustomer {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  createdAt: string;
  customer?: {
    name: string;
    phone: string;
  };
}

export const UnretrievedTickets = () => {
  const [tickets, setTickets] = useState<TicketWithCustomer[]>([]);
  
  console.log('UnretrievedTickets component mounting...');
  
  // Fetch tickets that are ready but not delivered
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['unretrieved-tickets'],
    queryFn: async () => {
      console.log('Fetching unretrieved tickets...');
      try {
        const result = await getUnretrievedTickets();
        console.log('Fetched tickets:', result);
        return result || [];
      } catch (err) {
        console.error('Error fetching unretrieved tickets:', err);
        throw err;
      }
    }
  });
  
  useEffect(() => {
    if (data) {
      console.log('Setting tickets data:', data);
      // Ensure the data matches our interface by properly transforming it
      const transformedTickets: TicketWithCustomer[] = data.map(ticket => ({
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        clientName: ticket.clientName,
        phoneNumber: ticket.phoneNumber || '', // Ensure phone is always a string
        totalPrice: ticket.totalPrice,
        createdAt: ticket.createdAt,
        customer: ticket.customer ? {
          name: ticket.customer.name,
          phone: ticket.customer.phone || '' // Ensure phone is always a string
        } : undefined
      }));
      setTickets(transformedTickets);
    }
  }, [data]);

  const handleMarkAsDelivered = async (ticketId: string) => {
    try {
      console.log('Marking ticket as delivered:', ticketId);
      const success = await markTicketAsDelivered(ticketId);
      if (success) {
        toast.success('Ticket marcado como entregado exitosamente');
        refetch(); // Refresh the list after marking as delivered
      } else {
        toast.error('Error al marcar el ticket como entregado');
      }
    } catch (err) {
      console.error('Error al marcar ticket como entregado:', err);
      toast.error('Error al marcar el ticket como entregado');
    }
  };
  
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy', { locale: es });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Fecha inválida';
    }
  };
  
  const columns = [
    {
      accessorKey: 'ticketNumber',
      header: 'Número',
    },
    {
      accessorKey: 'clientName',
      header: 'Cliente',
      cell: ({ row }: any) => row.original.customer?.name || row.original.clientName || 'Sin nombre',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Teléfono',
      cell: ({ row }: any) => row.original.customer?.phone || row.original.phoneNumber || 'Sin teléfono',
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }: any) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Importe',
      cell: ({ row }: any) => `$${(row.original.totalPrice || 0).toLocaleString()}`,
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleMarkAsDelivered(row.original.id)}
        >
          Marcar como entregado
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tickets No Retirados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Query error:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tickets No Retirados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            Error al cargar los tickets no retirados: {error instanceof Error ? error.message : 'Error desconocido'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets No Retirados</CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay tickets pendientes de retirar
          </div>
        ) : (
          <DataTable columns={columns} data={tickets} />
        )}
      </CardContent>
    </Card>
  );
};

export default UnretrievedTickets;
