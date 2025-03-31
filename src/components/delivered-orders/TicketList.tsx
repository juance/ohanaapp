
import { Ticket } from '@/lib/types';
import { TicketCard } from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicket: string | null;
  onSelectTicket: (id: string) => void;
}

export function TicketList({ tickets, selectedTicket, onSelectTicket }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="col-span-full text-center p-8 text-gray-500">
        No se encontraron tickets entregados
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          isSelected={selectedTicket === ticket.id}
          onClick={() => onSelectTicket(ticket.id)}
        />
      ))}
    </div>
  );
}
