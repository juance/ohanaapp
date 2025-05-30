
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Clock, CheckCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Orders = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Órdenes</h1>
          <p className="text-gray-600">Gestiona todas las órdenes de la lavandería</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar órdenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Filtros
        </Button>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendientes
          </TabsTrigger>
          <TabsTrigger value="processing" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            En Proceso
          </TabsTrigger>
          <TabsTrigger value="ready" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Listos
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Entregados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>No hay órdenes pendientes</p>
                <p className="text-sm">Las nuevas órdenes aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes en Proceso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>No hay órdenes en proceso</p>
                <p className="text-sm">Las órdenes que se están procesando aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Listas para Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>No hay órdenes listas</p>
                <p className="text-sm">Las órdenes completadas aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Entregadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p>No hay órdenes entregadas hoy</p>
                <p className="text-sm">El historial de entregas aparecerá aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Orders;
