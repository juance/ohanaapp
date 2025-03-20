
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
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showRedeemDialog, setShowRedeemDialog] = useState<boolean>(false);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const isMobile = useIsMobile();
  
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

  // Mobile view client cards
  const renderMobileClientCard = (customer: Customer) => (
    <Card key={customer.id} className="mb-3 shadow-sm">
      <CardHeader className="px-3 py-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{customer.name}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedCustomer(customer);
                setShowAddDialog(true);
              }}
              className="h-7 w-7 p-0"
            >
              <Star className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedCustomer(customer);
                setShowRedeemDialog(true);
              }}
              disabled={!customer.loyaltyPoints}
              className="h-7 w-7 p-0"
            >
              <Gift className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-2">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-gray-500" />
            <span>{customer.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span>
              {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd/MM/yy') : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className="h-3 w-3 text-blue-500" />
            <span>
              {customer.valetsCount || 0}
              {customer.freeValets > 0 && (
                <span className="ml-1 text-[10px] font-medium bg-green-100 text-green-800 px-1 py-0.5 rounded-full">
                  {customer.freeValets} gratis
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500" />
            <span>{customer.loyaltyPoints || 0} puntos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className={`flex-1 ${isMobile ? 'p-2' : 'md:ml-64 p-6'}`}>
        <div className="container mx-auto pt-4 md:pt-6">
          <header className="mb-4 md:mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-1 md:mb-2 text-sm md:text-base">
                <ArrowLeft className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-blue-600">Clientes</h1>
              <p className="text-xs md:text-sm text-gray-500">Directorio de clientes registrados</p>
            </div>
          </header>
          
          <Card className="mb-4 md:mb-8 shadow-sm">
            <CardHeader className={isMobile ? "px-3 py-2" : ""}>
              <CardTitle className="flex items-center gap-1 md:gap-2 text-lg md:text-xl">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
                Buscar Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 pt-0 pb-3" : ""}>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o teléfono..."
                    className="pl-7 md:pl-8 text-sm md:text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className={isMobile ? "px-3 py-2" : ""}>
              <CardTitle className="flex items-center gap-1 md:gap-2 text-lg md:text-xl">
                <User className="h-4 w-4 md:h-5 md:w-5" />
                Listado de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "px-3 pt-0 pb-3" : ""}>
              {isLoading ? (
                <div className="text-center py-4 text-sm md:text-base">Cargando clientes...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-4 text-sm md:text-base text-gray-500">
                  {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda' : 'No hay clientes registrados'}
                </div>
              ) : isMobile ? (
                <div className="space-y-1">
                  {filteredCustomers.map(renderMobileClientCard)}
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
          
          {isMobile ? (
            <>
              {/* Mobile Add Points Drawer */}
              <Drawer open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Añadir Puntos de Fidelidad</DrawerTitle>
                    <DrawerDescription>
                      Añadir puntos a {selectedCustomer?.name}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 py-2">
                    <div className="grid gap-3">
                      <div className="grid grid-cols-4 items-center gap-3">
                        <Label htmlFor="points-mobile" className="text-right text-sm">
                          Puntos
                        </Label>
                        <Input
                          id="points-mobile"
                          type="number"
                          min="1"
                          value={pointsToAdd}
                          onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                          className="col-span-3 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <DrawerFooter className="pt-2">
                    <Button onClick={handleAddPoints} className="text-sm">Añadir Puntos</Button>
                    <DrawerClose asChild>
                      <Button variant="outline" className="text-sm">Cancelar</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              {/* Mobile Redeem Points Drawer */}
              <Drawer open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Canjear Puntos de Fidelidad</DrawerTitle>
                    <DrawerDescription>
                      {selectedCustomer?.name} tiene {selectedCustomer?.loyaltyPoints || 0} puntos disponibles.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 py-2">
                    <div className="grid gap-3">
                      <div className="grid grid-cols-4 items-center gap-3">
                        <Label htmlFor="redeem-points-mobile" className="text-right text-sm">
                          Puntos
                        </Label>
                        <Input
                          id="redeem-points-mobile"
                          type="number"
                          min="1"
                          max={selectedCustomer?.loyaltyPoints || 0}
                          value={pointsToRedeem}
                          onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                          className="col-span-3 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <DrawerFooter className="pt-2">
                    <Button onClick={handleRedeemPoints} className="text-sm">Canjear Puntos</Button>
                    <DrawerClose asChild>
                      <Button variant="outline" className="text-sm">Cancelar</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <>
              {/* Desktop Add Points Dialog */}
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
              
              {/* Desktop Redeem Points Dialog */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
