
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import TicketForm from '@/components/TicketForm';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { Ticket, User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Search, PlusCircle, Send, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Mock ticket data
const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: '00000001',
    clientName: 'Maria Lopez',
    phoneNumber: '+5493512345678',
    services: [
      { id: '1', name: 'Washing', price: 15 },
      { id: '2', name: 'Drying', price: 10 },
    ],
    paymentMethod: 'cash',
    totalPrice: 25,
    status: 'ready',
    createdAt: '2023-11-24T10:30:00Z',
    updatedAt: '2023-11-24T14:30:00Z',
  },
  {
    id: '2',
    ticketNumber: '00000002',
    clientName: 'Carlos Rodriguez',
    phoneNumber: '+5493512345679',
    services: [
      { id: '1', name: 'Washing', price: 15 },
      { id: '3', name: 'Ironing', price: 20 },
    ],
    paymentMethod: 'debit',
    totalPrice: 35,
    status: 'processing',
    createdAt: '2023-11-24T11:15:00Z',
    updatedAt: '2023-11-24T13:45:00Z',
  },
  {
    id: '3',
    ticketNumber: '00000003',
    clientName: 'Ana Martinez',
    phoneNumber: '+5493512345680',
    services: [
      { id: '5', name: 'Stain Removal', price: 25 },
      { id: '4', name: 'Folding', price: 5 },
    ],
    paymentMethod: 'mercado_pago',
    totalPrice: 30,
    status: 'pending',
    createdAt: '2023-11-24T12:00:00Z',
    updatedAt: '2023-11-24T12:00:00Z',
  },
  {
    id: '4',
    ticketNumber: '00000004',
    clientName: 'Juan Gomez',
    phoneNumber: '+5493512345681',
    services: [
      { id: '6', name: 'Blanket Cleaning', price: 35 },
    ],
    paymentMethod: 'cuenta_dni',
    totalPrice: 35,
    status: 'delivered',
    createdAt: '2023-11-24T09:45:00Z',
    updatedAt: '2023-11-24T15:30:00Z',
  },
  {
    id: '5',
    ticketNumber: '00000005',
    clientName: 'Laura Fernandez',
    phoneNumber: '+5493512345682',
    services: [
      { id: '1', name: 'Washing', price: 15 },
      { id: '2', name: 'Drying', price: 10 },
      { id: '3', name: 'Ironing', price: 20 },
    ],
    paymentMethod: 'cash',
    totalPrice: 45,
    status: 'ready',
    createdAt: '2023-11-24T08:30:00Z',
    updatedAt: '2023-11-24T12:15:00Z',
  },
];

const Tickets = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        navigate('/');
        return;
      }
      
      if (!hasPermission(currentUser, ['admin', 'cashier'])) {
        navigate('/dashboard');
        toast.error('Access denied', {
          description: 'You do not have permission to access this page',
        });
        return;
      }
      
      setUser(currentUser);
    };
    
    checkAuth();
  }, [navigate]);
  
  useEffect(() => {
    let filtered = mockTickets;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((ticket) => 
        ticket.ticketNumber.includes(query) || 
        ticket.clientName.toLowerCase().includes(query) ||
        ticket.phoneNumber.includes(query)
      );
    }
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter((ticket) => ticket.status === activeTab);
    }
    
    setFilteredTickets(filtered);
  }, [searchQuery, activeTab]);
  
  const handleNotifyClient = (ticket: Ticket) => {
    toast.success('WhatsApp notification sent', {
      description: `Notification sent to ${ticket.clientName}`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="border-green-500 text-green-500">Ready</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
            <p className="mt-1 text-muted-foreground">
              Create and manage customer laundry tickets
            </p>
          </div>
          
          <Tabs defaultValue="list" className="mb-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="list">Ticket List</TabsTrigger>
                <TabsTrigger value="create">Create Ticket</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="list" className="mt-6 animate-fade-in">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <CardTitle>All Tickets</CardTitle>
                    <div className="flex w-full flex-col space-y-4 md:w-auto md:flex-row md:space-x-4 md:space-y-0">
                      <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search by ticket #, name or phone..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          const tab = document.querySelector('[data-value="create"]') as HTMLButtonElement;
                          if (tab) tab.click();
                        }}
                        className="bg-laundry-500 hover:bg-laundry-600"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Ticket
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-4 overflow-hidden rounded-lg border">
                    <div className="flex border-b">
                      <button
                        className={`flex-1 px-4 py-2 text-center text-sm font-medium ${
                          activeTab === 'all' ? 'border-b-2 border-laundry-500 text-laundry-500' : 'text-muted-foreground'
                        }`}
                        onClick={() => setActiveTab('all')}
                      >
                        All
                      </button>
                      <button
                        className={`flex-1 px-4 py-2 text-center text-sm font-medium ${
                          activeTab === 'pending' ? 'border-b-2 border-laundry-500 text-laundry-500' : 'text-muted-foreground'
                        }`}
                        onClick={() => setActiveTab('pending')}
                      >
                        Pending
                      </button>
                      <button
                        className={`flex-1 px-4 py-2 text-center text-sm font-medium ${
                          activeTab === 'processing' ? 'border-b-2 border-laundry-500 text-laundry-500' : 'text-muted-foreground'
                        }`}
                        onClick={() => setActiveTab('processing')}
                      >
                        Processing
                      </button>
                      <button
                        className={`flex-1 px-4 py-2 text-center text-sm font-medium ${
                          activeTab === 'ready' ? 'border-b-2 border-laundry-500 text-laundry-500' : 'text-muted-foreground'
                        }`}
                        onClick={() => setActiveTab('ready')}
                      >
                        Ready
                      </button>
                      <button
                        className={`flex-1 px-4 py-2 text-center text-sm font-medium ${
                          activeTab === 'delivered' ? 'border-b-2 border-laundry-500 text-laundry-500' : 'text-muted-foreground'
                        }`}
                        onClick={() => setActiveTab('delivered')}
                      >
                        Delivered
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] table-auto">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                              Ticket #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                              Client
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                              Services
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                              Total
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                              Created
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTickets.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                                No tickets found
                              </td>
                            </tr>
                          ) : (
                            filteredTickets.map((ticket) => (
                              <tr key={ticket.id} className="border-b last:border-0 hover:bg-muted/20">
                                <td className="px-4 py-3 text-sm font-mono">{ticket.ticketNumber}</td>
                                <td className="px-4 py-3">
                                  <div>
                                    <div className="font-medium">{ticket.clientName}</div>
                                    <div className="text-xs text-muted-foreground">{ticket.phoneNumber}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {ticket.services.map((service) => (
                                      <Badge key={service.id} variant="secondary" className="text-xs">
                                        {service.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-medium">${ticket.totalPrice}</td>
                                <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                  {formatDate(ticket.createdAt)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex justify-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8 text-laundry-500"
                                      onClick={() => handleNotifyClient(ticket)}
                                    >
                                      <Send className="h-4 w-4" />
                                      <span className="sr-only">Notify Client</span>
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">More options</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="flex items-center">
                                          <Eye className="mr-2 h-4 w-4" />
                                          <span>View Details</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="create" className="mt-6 animate-fade-in">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Create New Ticket</h2>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below to create a new laundry ticket
                </p>
              </div>
              <TicketForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
