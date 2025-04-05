
import React from 'react';
import { LaundryOption, Ticket } from '@/lib/types';
import { TicketFormContainer } from './ticket/TicketFormContainer';
import { Instructions } from './ticket/Instructions';

const SimpleTicketForm = ({ onTicketGenerated }: { onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void }) => {
  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-8">
        <TicketFormContainer onTicketGenerated={onTicketGenerated} />
      </div>
      
      {/* Instructions panel */}
      <div className="md:col-span-4">
        <Instructions />
      </div>
    </div>
  );
};

export default SimpleTicketForm;
