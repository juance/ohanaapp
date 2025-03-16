
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Check } from 'lucide-react';

// Mock delivered ticket data
const mockDeliveredTickets = [
  {
    id: '1',
    ticketNumber: '00000001',
    clientName: 'Tiziano',
    phoneNumber: '1123456716',
    date: '10/03/2023',
    total: 22000,
    deliveredDate: '12/03/2023'
  },
  {
    id: '2',
    ticketNumber: '00000002',
    clientName: 'Laura',
    phoneNumber: '1123456789',
    date: '11/03/2023',
    total: 15500,
    deliveredDate: '13/03/2023'
  },
  {
    id: '3',
    ticketNumber: '00000003',
    clientName: 'Carlos',
    phoneNumber: '1123789456',
    date: '12/03/2023',
    total: 18700,
    deliveredDate: '14/03/2023'
  }
];

const DeliveredOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  const filteredTickets = searchQuery.trim() 
    ? mockDeliveredTickets.filter(ticket => 
        ticket.ticketNumber.includes(searchQuery) ||
        ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.phoneNumber.includes(searchQuery)
      )
    : mockDeliveredTickets;
    
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
            <h2 className="text-xl font-bold mb-4">Pedidos Entregados</h2>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por ticket, nombre o teléfono"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map(ticket => (
                <Card 
                  key={ticket.id}
                  className={`
                    cursor-pointer transition-all
                    ${selectedTicket === ticket.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-blue-200'}
                  `}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">{ticket.clientName}</div>
                        <div className="text-sm text-gray-500">{ticket.phoneNumber}</div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                        <Check className="h-3 w-3" />
                        <span>Entregado</span>
                      </div>
                    </div>
                    <div className="text-sm mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Fecha de creación:</span>
                        <span>{ticket.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha de entrega:</span>
                        <span>{ticket.deliveredDate}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <Button size="sm" variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 text-xs">
                        {ticket.ticketNumber}
                      </Button>
                      <span className="font-medium text-blue-700">$ {ticket.total.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTickets.length === 0 && (
                <div className="col-span-full text-center p-8 text-gray-500">
                  No se encontraron tickets entregados
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveredOrders;
