
import React, { useRef } from 'react';
import { Ticket, LaundryOption } from '@/lib/types';
import TicketPrintContent from './ticket/TicketPrintContent';
import { handleTicketPrint } from '@/utils/printUtils';
import { Button } from './ui/button';

interface TicketPrintProps {
  ticket: Ticket;
  selectedOptions: LaundryOption[];
  onClose: () => void;
}

const TicketPrint: React.FC<TicketPrintProps> = ({ ticket, selectedOptions, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const onPrint = () => {
    handleTicketPrint(ticket, selectedOptions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={printRef}>
        <TicketPrintContent 
          ticket={ticket} 
          selectedOptions={selectedOptions} 
        />
        
        <div className="bg-white p-4 rounded-b-lg flex justify-between">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Cerrar
          </Button>
          <Button
            onClick={onPrint}
            variant="default"
          >
            Imprimir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketPrint;
