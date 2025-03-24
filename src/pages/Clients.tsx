
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Gift, Edit, Save, X } from 'lucide-react';
import { useClientData } from '@/hooks/useClientData';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';
import { addLoyaltyPoints, redeemLoyaltyPoints } from '@/lib/dataService';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
}

const Clients = () => {
  const { toast } = useToast();
  const { loading, error, frequentClients, clients, refreshData } = useClientData();
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isEditingClient, setIsEditingClient] = useState<string | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  
  const handleAddClient = async () => {
    if (!newClientName || !newClientPhone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nombre y teléfono son campos obligatorios.",
      });
      return;
    }
    
    setIsAddingClient(true);
    try {
      const { error } = await supabase
        .from('customers')
        .insert({
          name: newClientName,
          phone: newClientPhone,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0
        });
        
      if (error) throw error;
      
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
    } catch (err: any) {
      console.error("Error adding client:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Hubo un error al agregar el cliente.",
      });
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleEditClient = (client: Client) => {
    setIsEditingClient(client.id);
    setEditClientName(client.clientName);
    setEditClientPhone(client.phoneNumber);
  };

  const handleSaveClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: editClientName,
          phone: editClientPhone
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente han sido actualizados.",
      });
      
      setIsEditingClient(null);
      await refreshData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Error al actualizar el cliente.",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingClient(null);
  };

  const handleSelectClient = async (client: Client) => {
    setSelectedClient(client);
    setPointsToAdd(0);
    setPointsToRedeem(0);
    
    // Load full client data including loyalty points
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('loyalty_points, free_valets, valets_count')
        .eq('id', client.id)
        .single();
        
      if (error) throw error;
      
      setSelectedClient({
        ...client,
        loyaltyPoints: data.loyalty_points,
        freeValets: data.free_valets,
        valetsCount: data.valets_count
      });
    } catch (err) {
      console.error("Error loading client details:", err);
    }
  };
  
  const handleAddPoints = async () => {
    if (!selectedClient || pointsToAdd <= 0) return;
    
    setIsAddingPoints(true);
    try {
      const success = await addLoyaltyPoints(selectedClient.id, pointsToAdd);
      
      if (success) {
        toast({
          title: "Puntos agregados",
          description: `${pointsToAdd} puntos añadidos a ${selectedClient.clientName}`,
        });
        
        // Update selected client
        setSelectedClient({
          ...selectedClient,
          loyaltyPoints: (selectedClient.loyaltyPoints || 0) + pointsToAdd
        });
        
        setPointsToAdd(0);
        await refreshData();
      } else {
        throw new Error("No se pudieron agregar los puntos");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Error al agregar puntos",
      });
    } finally {
      setIsAddingPoints(false);
    }
  };
  
  const handleRedeemPoints = async () => {
    if (!selectedClient || !selectedClient.loyaltyPoints || pointsToRedeem <= 0 || pointsToRedeem > selectedClient.loyaltyPoints) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La cantidad de puntos a canjear no es válida",
      });
      return;
    }
    
    try {
      const success = await redeemLoyaltyPoints(selectedClient.id, pointsToRedeem);
      
      if (success) {
        toast({
          title: "Puntos canjeados",
          description: `${pointsToRedeem} puntos canjeados de ${selectedClient.clientName}`,
        });
        
        // Update selected client
        setSelectedClient({
          ...selectedClient,
          loyaltyPoints: selectedClient.loyaltyPoints - pointsToRedeem
        });
        
        setPointsToRedeem(0);
        await refreshData();
      } else {
        throw new Error("No se pudieron canjear los puntos");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Error al canjear puntos",
      });
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
                          className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer ${selectedClient?.id === client.id ? 'bg-blue-50 border-blue-200' : ''}`}
                          onClick={() => handleSelectClient(client)}
                        >
                          {isEditingClient === client.id ? (
                            <>
                              <div className="space-y-1 flex-1 mr-2">
                                <Input 
                                  value={editClientName} 
                                  onChange={(e) => setEditClientName(e.target.value)}
                                  className="mb-2"
                                />
                                <Input 
                                  value={editClientPhone} 
                                  onChange={(e) => setEditClientPhone(e.target.value)}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleSaveClient(client.id)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
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
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClient(client);
                                  }}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Editar</span>
                                </Button>
                              </div>
                            </>
                          )}
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
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-blue-600" />
                    Programa de Lealtad
                  </CardTitle>
                  <CardDescription>Administrar puntos de lealtad de los clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedClient ? (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                        <h3 className="font-medium mb-2">Cliente: {selectedClient.clientName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-3 rounded-md shadow-sm border">
                            <div className="text-sm text-gray-500">Puntos de lealtad</div>
                            <div className="text-xl font-bold text-blue-700">{selectedClient.loyaltyPoints || 0}</div>
                          </div>
                          <div className="bg-white p-3 rounded-md shadow-sm border">
                            <div className="text-sm text-gray-500">Valets acumulados</div>
                            <div className="text-xl font-bold text-blue-700">{selectedClient.valetsCount || 0}</div>
                          </div>
                          <div className="bg-white p-3 rounded-md shadow-sm border">
                            <div className="text-sm text-gray-500">Valets gratis</div>
                            <div className="text-xl font-bold text-blue-700">{selectedClient.freeValets || 0}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Agregar puntos</h4>
                          <div className="flex space-x-2">
                            <Input 
                              type="number" 
                              min="1"
                              value={pointsToAdd || ''}
                              onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                              placeholder="Puntos a agregar"
                            />
                            <Button 
                              onClick={handleAddPoints} 
                              disabled={isAddingPoints || pointsToAdd <= 0}
                            >
                              {isAddingPoints ? <Loading className="h-4 w-4" /> : "Agregar"}
                            </Button>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Canjear puntos</h4>
                          <div className="flex space-x-2">
                            <Input 
                              type="number" 
                              min="1"
                              max={selectedClient.loyaltyPoints || 0}
                              value={pointsToRedeem || ''}
                              onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                              placeholder="Puntos a canjear"
                            />
                            <Button 
                              onClick={handleRedeemPoints} 
                              disabled={!selectedClient.loyaltyPoints || pointsToRedeem <= 0 || pointsToRedeem > (selectedClient.loyaltyPoints || 0)}
                            >
                              Canjear
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Seleccione un cliente para administrar sus puntos de lealtad y valets gratuitos.
                    </p>
                  )}
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
