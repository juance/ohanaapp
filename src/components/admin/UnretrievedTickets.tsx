
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUnretrievedTickets } from '@/lib/dataService';
import { markTicketAsDelivered } from '@/lib/ticketServices';
import { Ticket } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/lib/toast';

export const UnretrievedTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  
  // Fetch tickets that are ready but not delivered
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['unretrieved-tickets'],
    queryFn: async () => {
      // Call without arguments since the function doesn't expect any
      return getUnretrievedTickets();
    }
  });
  
  useEffect(() => {
    if (data) {
      setTickets(data);
    }
  }, [data]);

  const handleMarkAsDelivered = async (ticketId: string) => {
    try {
      const success = await markTicketAsDelivered(ticketId);
      if (success) {
        toast.success('Ticket marcado como entregado exitosamente');
        refetch(); // Refresh the list after marking as delivered
      }
    } catch (err) {
      console.error('Error al marcar ticket como entregado:', err);
      toast.error('Error al marcar el ticket como entregado');
    }
  };
  
  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  };
  
  const columns = [
    {
      accessorKey: 'ticketNumber',
      header: 'Número',
    },
    {
      accessorKey: 'clientName',
      header: 'Cliente',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Teléfono',
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }: any) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'totalPrice',
      header: 'Importe',
      cell: ({ row }: any) => `$${row.original.totalPrice.toLocaleString()}`,
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tickets No Retirados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            Error al cargar los tickets no retirados
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
