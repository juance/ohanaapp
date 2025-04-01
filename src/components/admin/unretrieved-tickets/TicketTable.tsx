
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TicketTableProps {
  tickets: any[];
  days: number;
  onOpenMessageDialog: (ticket: any, type: '45days' | '90days') => void;
}

export function TicketTable({ tickets, days, onOpenMessageDialog }: TicketTableProps) {
  // Format date utilities
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  const calculateDaysSince = (dateString: string) => {
    try {
      const ticketDate = new Date(dateString);
      const today = new Date();
      const diffTime = today.getTime() - ticketDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return 0;
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No hay tickets sin retirar desde hace {days} días.</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableCaption>
        Total: {tickets.length} tickets sin retirar por más de {days} días
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>N° Ticket</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Días sin retirar</TableHead>
          <TableHead>Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.ticketNumber || 'N/A'}</TableCell>
            <TableCell>{ticket.clientName}</TableCell>
            <TableCell>{ticket.phoneNumber}</TableCell>
            <TableCell>{formatDate(ticket.createdAt)}</TableCell>
            <TableCell>
              <Badge className={days >= 90 ? "bg-red-500" : "bg-yellow-500"}>
                {calculateDaysSince(ticket.createdAt)} días
              </Badge>
            </TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onOpenMessageDialog(ticket, days >= 90 ? '90days' : '45days')}
                className="flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
