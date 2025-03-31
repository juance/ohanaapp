

import Navbar from '@/components/Navbar';
import SimpleTicketForm from '@/components/SimpleTicketForm';
import TicketPrint from '@/components/TicketPrint';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket, LaundryOption } from '@/lib/types';

const Tickets = () => {
  const [printTicket, setPrintTicket] = useState<Ticket | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<LaundryOption[]>([]);

  const handleTicketGenerated = (ticket: Ticket, options: LaundryOption[]) => {
    setPrintTicket(ticket);
    setSelectedOptions(options);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
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
        </div>
      </div>

      {printTicket && (
        <TicketPrint 
          ticket={printTicket} 
          selectedOptions={selectedOptions}
          onClose={() => setPrintTicket(null)} 
        />
      )}
    </div>
  );
};

export default Tickets;
