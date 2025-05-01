
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Customer, ClientVisit } from '@/lib/types';
import { useCachedClients } from '@/hooks/useCachedClients';
import ClientList from '@/components/clients/ClientList';
import { convertCustomerToClientVisit } from '@/lib/types/customer.types';

const Clients = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isEditingClient, setIsEditingClient] = useState<string | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  // Add local clients state to use with useCachedClients
  const [localClients, setLocalClients] = useState<ClientVisit[]>([]);

  const { clients, isLoading, error, refetch, invalidateCache } = useCachedClients();

  // Update local clients when clients from hook changes
  useEffect(() => {
    setLocalClients(clients);
  }, [clients]);

  const addCustomer = async (name: string, phone: string) => {
    setIsAdding(true);
    try {
      // Basic validation
      if (!name || !phone) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Por favor, complete todos los campos."
        });
        setIsAdding(false);
        return;
      }

      // Optimistically update the UI
      const newCustomer: Customer = {
        id: Math.random().toString(36).substring(7), // Temporary ID
        name: name,
        phone: phone,
        valetsCount: 0,
        freeValets: 0,
        loyaltyPoints: 0,
        lastVisit: new Date().toISOString(),
        phoneNumber: phone
      };

      // Use the convertCustomerToClientVisit function from customer.types.ts
      const clientVisit = convertCustomerToClientVisit(newCustomer);
      setLocalClients(prev => [...prev, clientVisit]);
      setIsAdding(false);

      // Clear the form
      setNewClientName('');
      setNewClientPhone('');

      toast({
        title: "Éxito",
        description: "Cliente agregado correctamente."
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al agregar cliente: ${typeof error === 'string' ? error : (error as Error).message}`
      });
      setIsAdding(false);
    }
  };

  const editCustomer = async (id: string, name: string, phone: string) => {
    try {
      // Optimistically update the UI
      const updatedClient = {
        ...localClients.find(c => c.id === id),
        clientName: name,
        phoneNumber: phone
      };
      setLocalClients((prevClients) =>
        prevClients.map((client) =>
          client.id === id ? updatedClient : client
        )
      );
      setIsEditingClient(null);

      toast({
        title: "Éxito",
        description: "Cliente actualizado correctamente."
      });
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Error al actualizar cliente: ${typeof error === 'string' ? error : (error as Error).message}`
      });
    }
  };

  const handleEditClient = (client: ClientVisit) => {
    setIsEditingClient(client.id);
    setEditClientName(client.clientName);
    setEditClientPhone(client.phoneNumber);
  };

  const handleSaveClient = (id: string) => {
    editCustomer(id, editClientName, editClientPhone)
      .then(() => {
        // Use the convertCustomerToClientVisit function for consistency
        const updatedClient = {
          ...localClients.find(c => c.id === id),
          clientName: editClientName,
          phoneNumber: editClientPhone
        };
        setLocalClients((prevClients) =>
          prevClients.map((client) =>
            client.id === id ? updatedClient : client
          )
        );
        setIsEditingClient(null);
      })
      .catch((error) => {
        console.error('Error updating client:', error);
        toast.error(`Error al actualizar cliente: ${typeof error === 'string' ? error : (error as Error).message}`);
      });
  };

  const handleCancelEdit = () => {
    setIsEditingClient(null);
  };

  const handleSelectClient = (client: ClientVisit) => {
    setSelectedClient(client);
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditClientName(e.target.value);
  };

  const handleEditPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditClientPhone(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Refrescar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => invalidateCache()}>
              Invalidar Cache
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Cliente</CardTitle>
              <CardDescription>Agregar un nuevo cliente a la lista</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    type="text"
                    id="name"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    type="tel"
                    id="phone"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                  />
                </div>
                <Button onClick={() => addCustomer(newClientName, newClientPhone)} disabled={isAdding}>
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Agregando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Cliente
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <ClientList
            clients={localClients}
            isEditingClient={isEditingClient}
            editClientName={editClientName}
            editClientPhone={editClientPhone}
            selectedClient={selectedClient}
            onEditClient={handleEditClient}
            onSaveClient={handleSaveClient}
            onCancelEdit={handleCancelEdit}
            onSelectClient={handleSelectClient}
            onEditNameChange={handleEditNameChange}
            onEditPhoneChange={handleEditPhoneChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
