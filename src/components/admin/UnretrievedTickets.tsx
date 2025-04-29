
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUnretrievedTickets } from '@/lib/ticketServices';
import { Ticket } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DateRangeSelector from '@/components/shared/DateRangeSelector';
import { toast } from '@/hooks/use-toast';

export const UnretrievedTickets = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['unretrievedTickets'],
    queryFn: () => getUnretrievedTickets(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  useEffect(() => {
    if (!tickets) return;

    let filtered = [...tickets];

    if (startDate) {
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate >= startDate;
      });
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate <= endOfDay;
      });
    }

    setFilteredTickets(filtered);
  }, [tickets, startDate, endDate]);

  const handleRefresh = () => {
    refetch();
    toast({
      title: 'Lista de tickets actualizada'
    });
  };

  if (isLoading) {
    return <div>Cargando tickets no retirados...</div>;
  }

  if (error) {
    return <div>Error al cargar los tickets</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tickets sin retirar</CardTitle>
        <div className="flex gap-4">
          <DateRangeSelector 
            from={startDate || new Date()} 
            to={endDate || new Date()}
            onUpdate={(from, to) => {
              setStartDate(from);
              setEndDate(to);
            }}
          />
          <Button onClick={handleRefresh} size="sm">Actualizar</Button>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTickets.length === 0 ? (
          <div className="text-center py-4">No hay tickets sin retirar en el período seleccionado</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.ticketNumber}</TableCell>
                  <TableCell>{ticket.clientName || 'N/A'}</TableCell>
                  <TableCell>{ticket.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <FormatDate date={ticket.createdAt} />
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      ticket.status === 'ready' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status === 'pending' ? 'Pendiente' : 
                       ticket.status === 'ready' ? 'Listo' : 
                       ticket.status === 'processing' ? 'Procesando' : 
                       ticket.status}
                    </span>
                  </TableCell>
                  <TableCell>${ticket.totalPrice?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

// FormatDate component para evitar conflicto con el import
const FormatDate = ({ date }: { date: string }) => {
  if (!date) return <span>N/A</span>;
  
  try {
    const formattedDate = new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return <span>{formattedDate}</span>;
  } catch (e) {
    return <span>Fecha inválida</span>;
  }
};
