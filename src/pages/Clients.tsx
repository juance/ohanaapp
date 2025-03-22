
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';

interface Client {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: string;
}

const Clients = () => {
  const { toast } = useToast();
  const { loading, error, frequentClients, clients, refreshData } = useClientData();
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  
  const handleAddClient = async () => {
    setIsAddingClient(true);
    try {
      // Simulate adding a new client (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Cliente agregado",
        description: "El cliente ha sido agregado exitosamente.",
      });
      
      // Refresh data
      await refreshData();
      
      // Clear form
      setNewClientName('');
      setNewClientPhone('');
    } catch (err) {
      console.error("Error adding client:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al agregar el cliente.",
      });
    } finally {
      setIsAddingClient(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto max-w-6xl pt-6">
          <header className="mb-8">
            <Link to="/" className="mb-2 flex items-center text-blue-600 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Clientes</h1>
            <p className="text-gray-500">Administra y consulta información de clientes</p>
          </header>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="text-lg font-medium text-red-800">Error al cargar clientes</h3>
              <p className="text-red-700">{error.message}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Frecuentes</CardTitle>
                  <CardDescription>Clientes con más visitas a la lavandería</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {frequentClients.length > 0 ? (
                      frequentClients.map((client) => (
                        <div
                          key={client.id || client.phoneNumber}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="space-y-1">
                            <h3 className="font-medium">{client.clientName}</h3>
                            <div className="text-sm text-muted-foreground">{client.phoneNumber}</div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              {client.visitCount} visitas
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Última visita: {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-32 items-center justify-center text-center text-muted-foreground">
                        No hay datos de clientes frecuentes disponibles
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agregar Cliente</CardTitle>
                  <CardDescription>Agregar un nuevo cliente a la base de datos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Teléfono
                      </Label>
                      <Input
                        type="tel"
                        id="phone"
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <Button onClick={handleAddClient} disabled={isAddingClient}>
                      {isAddingClient ? (
                        <>
                          <Loading className="mr-2" />
                          Agregando...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Agregar Cliente
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Loyalty Program Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Programa de Lealtad</CardTitle>
                  <CardDescription>Administrar puntos de lealtad de los clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Funcionalidad en desarrollo. ¡Pronto podrás administrar los puntos de lealtad de tus clientes!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
