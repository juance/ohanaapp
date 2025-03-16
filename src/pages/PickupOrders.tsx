
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Bell } from 'lucide-react';
import { toast } from 'sonner';

// Mock ticket data
const mockTickets = [
  {
    id: '1',
    ticketNumber: '00000001',
    clientName: 'Tiziano',
    phoneNumber: '1123456716',
    date: '16/03/2023',
    total: 24000
  },
  {
    id: '2',
    ticketNumber: '00000002',
    clientName: 'Tiziano',
    phoneNumber: '1123456716',
    date: '16/03/2023',
    total: 18500
  },
  {
    id: '3',
    ticketNumber: '00000003',
    clientName: 'Tiziano',
    phoneNumber: '1123456716',
    date: '16/03/2023',
    total: 17000
  },
  {
    id: '4',
    ticketNumber: '00000004',
    clientName: 'Tiziano',
    phoneNumber: '1123456716',
    date: '16/03/2023',
    total: 9000
  },
  {
    id: '5',
    ticketNumber: '00000005',
    clientName: 'Tiziano',
    phoneNumber: '1123456716',
    date: '16/03/2023',
    total: 15000
  }
];

const PickupOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  const filteredTickets = searchQuery.trim() 
    ? mockTickets.filter(ticket => 
        ticket.ticketNumber.includes(searchQuery) ||
        ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.phoneNumber.includes(searchQuery)
      )
    : mockTickets;
    
  const handleNotifyClient = (ticketId: string) => {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
      toast.success(`Notificación enviada a ${ticket.clientName}`, {
        description: `Se notificó que su pedido #${ticket.ticketNumber} está listo para retirar.`
      });
    }
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
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Pedidos a Retirar</h2>
            
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => handleNotifyClient(selectedTicket || '1')}
                disabled={!selectedTicket}
              >
                <Bell className="h-4 w-4" />
                <span>Avisar al cliente</span>
              </Button>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
                Ticket
              </Button>
              <Button variant="outline">Nombre</Button>
              <Button variant="outline">Teléfono</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 space-y-4 border rounded-lg p-4 bg-gray-50">
                {filteredTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    className={`
                      p-3 border rounded-lg bg-white cursor-pointer transition-all
                      ${selectedTicket === ticket.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="font-medium">{ticket.clientName}</div>
                    <div className="text-sm text-gray-500">{ticket.phoneNumber}</div>
                    <div className="text-sm text-gray-500">Fecha: {ticket.date}</div>
                    <div className="mt-2 flex justify-between items-center">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">
                        {ticket.ticketNumber}
                      </Button>
                      <span className="font-medium text-blue-700">$ {ticket.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="md:col-span-3 border rounded-lg p-6 flex items-center justify-center bg-gray-50">
                {selectedTicket ? (
                  <div className="w-full space-y-4">
                    <h3 className="text-lg font-medium">Detalles del Ticket</h3>
                    <p>Seleccione un ticket para ver los detalles</p>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Seleccione un ticket para ver los detalles</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupOrders;
