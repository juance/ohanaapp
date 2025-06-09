
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Package, Clock, CheckCircle, Phone } from 'lucide-react';
import { useCustomerPortal } from '@/hooks/customer/useCustomerPortal';

const CustomerPortal: React.FC = () => {
  const [searchPhone, setSearchPhone] = useState('');
  const { 
    customerData, 
    tickets, 
    isLoading, 
    searchCustomer,
    sendNotification 
  } = useCustomerPortal();

  const handleSearch = () => {
    if (searchPhone.trim()) {
      searchCustomer(searchPhone);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'delivered': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En Proceso';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Portal del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Ingrese su número de teléfono"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {customerData && (
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido, {customerData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {customerData.totalOrders || 0}
                </div>
                <div className="text-sm text-gray-600">Órdenes Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {customerData.loyaltyPoints || 0}
                </div>
                <div className="text-sm text-gray-600">Puntos de Lealtad</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {customerData.freeValets || 0}
                </div>
                <div className="text-sm text-gray-600">Valets Gratis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mis Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Activas</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {tickets
                  .filter(ticket => ticket.status !== 'delivered')
                  .map((ticket) => (
                    <Card key={ticket.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">
                              Ticket #{ticket.ticketNumber}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(ticket.date).toLocaleDateString()}
                            </div>
                            <div className="text-lg font-bold text-green-600 mt-2">
                              ${ticket.total.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(ticket.status)}>
                              {getStatusText(ticket.status)}
                            </Badge>
                            {ticket.status === 'ready' && (
                              <Button
                                size="sm"
                                className="mt-2"
                                onClick={() => sendNotification(ticket.id)}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Notificar
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                {tickets
                  .filter(ticket => ticket.status === 'delivered')
                  .map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">
                              Ticket #{ticket.ticketNumber}
                            </div>
                            <div className="text-sm text-gray-600">
                              Entregado: {ticket.deliveredDate ? 
                                new Date(ticket.deliveredDate).toLocaleDateString() : 
                                'N/A'
                              }
                            </div>
                            <div className="text-lg font-bold text-green-600 mt-2">
                              ${ticket.total.toLocaleString()}
                            </div>
                          </div>
                          <Badge variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Entregado
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {tickets.length === 0 && customerData && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">
              No tienes órdenes actualmente
            </h3>
            <p className="text-gray-500">
              Cuando realices una orden, aparecerá aquí
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerPortal;
