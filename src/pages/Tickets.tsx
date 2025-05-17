
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SimpleTicketForm from '@/components/SimpleTicketForm';
import TicketPrint from '@/components/TicketPrint';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket, LaundryOption } from '@/lib/types';
import ErrorBoundary from '@/components/ErrorBoundary';

const Tickets = () => {
  const [printTicket, setPrintTicket] = useState<Ticket | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<LaundryOption[]>([]);

  const handleTicketGenerated = (ticket: Ticket, options: LaundryOption[]) => {
    setPrintTicket(ticket);
    setSelectedOptions(options);
  };

  return (
    <ErrorBoundary>
      <Layout>
        <header className="mb-8">
          <div>
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
            <p className="text-gray-500">Sistema de Tickets</p>
          </div>
        </header>
        
        <SimpleTicketForm onTicketGenerated={handleTicketGenerated} />

        {printTicket && (
          <TicketPrint 
            ticket={printTicket} 
            selectedOptions={selectedOptions}
            onClose={() => setPrintTicket(null)} 
          />
        )}
      </Layout>
    </ErrorBoundary>
  );
};

export default Tickets;
