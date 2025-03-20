
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Search, User, Phone, Star, Gift, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getAllCustomers, addLoyaltyPoints, redeemLoyaltyPoints } from '@/lib/customerService';
import { Customer } from '@/lib/types';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showRedeemDialog, setShowRedeemDialog] = useState<boolean>(false);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  
  // Fetch all customers
  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: getAllCustomers
  });
  
  // Filter customers based on search term
  const filteredCustomers = customers?.filter(customer => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchTermLower) ||
      customer.phoneNumber.toLowerCase().includes(searchTermLower)
    );
  }) || [];

  const handleAddPoints = async () => {
    if (!selectedCustomer || pointsToAdd <= 0) return;
    
    const success = await addLoyaltyPoints(selectedCustomer.id, pointsToAdd);
    
    if (success) {
      toast.success(`Se agregaron ${pointsToAdd} puntos a ${selectedCustomer.name}`);
      setShowAddDialog(false);
      setPointsToAdd(0);
      refetch();
    } else {
      toast.error("No se pudieron agregar los puntos");
    }
  };
  
  const handleRedeemPoints = async () => {
    if (!selectedCustomer || pointsToRedeem <= 0) return;
    
    if (selectedCustomer.loyaltyPoints < pointsToRedeem) {
      toast.error("El cliente no tiene suficientes puntos");
      return;
    }
    
    const success = await redeemLoyaltyPoints(selectedCustomer.id, pointsToRedeem);
    
    if (success) {
      toast.success(`Se canjearon ${pointsToRedeem} puntos de ${selectedCustomer.name}`);
      setShowRedeemDialog(false);
      setPointsToRedeem(0);
      refetch();
    } else {
      toast.error("No se pudieron canjear los puntos");
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
              <h1 className="text-2xl font-bold text-blue-600">Clientes</h1>
              <p className="text-gray-500">Directorio de clientes registrados</p>
            </div>
          </header>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Search className="h-5 w-5" />
                Buscar Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o teléfono..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="h-5 w-5" />
                Listado de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Cargando clientes...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda' : 'No hay clientes registrados'}
                </div>
              ) : (
                <div className="overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Registro</TableHead>
                        <TableHead>Última Visita</TableHead>
                        <TableHead>Valets</TableHead>
                        <TableHead>Puntos</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span>{customer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{customer.phoneNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>{format(new Date(customer.createdAt), 'dd/MM/yyyy')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>
                                {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd/MM/yyyy') : 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          
                          {/* Nueva celda para valets */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4 text-blue-500" />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">
                                      {customer.valetsCount || 0}
                                      {customer.freeValets > 0 && (
                                        <span className="ml-2 text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                          {customer.freeValets} gratis
                                        </span>
                                      )}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-blue-50 text-blue-800 border border-blue-200">
                                    <div className="p-1">
                                      <p>Total valets: {customer.valetsCount}</p>
                                      <p>Valets gratis disponibles: {customer.freeValets}</p>
                                      <p className="text-xs mt-1">Por cada 9 valets, 1 valet gratis</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{customer.loyaltyPoints || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setShowAddDialog(true);
                                }}
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Añadir
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setShowRedeemDialog(true);
                                }}
                                disabled={!customer.loyaltyPoints}
                              >
                                <Gift className="h-4 w-4 mr-1" />
                                Canjear
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Dialog para añadir puntos */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Puntos de Fidelidad</DialogTitle>
                <DialogDescription>
                  Añadir puntos a {selectedCustomer?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="points" className="text-right">
                    Puntos
                  </Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={pointsToAdd}
                    onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
                <Button onClick={handleAddPoints}>Añadir Puntos</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Dialog para canjear puntos */}
          <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Canjear Puntos de Fidelidad</DialogTitle>
                <DialogDescription>
                  {selectedCustomer?.name} tiene {selectedCustomer?.loyaltyPoints || 0} puntos disponibles.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="redeem-points" className="text-right">
                    Puntos a Canjear
                  </Label>
                  <Input
                    id="redeem-points"
                    type="number"
                    min="1"
                    max={selectedCustomer?.loyaltyPoints || 0}
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>Cancelar</Button>
                <Button onClick={handleRedeemPoints}>Canjear Puntos</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Clients;
