
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Package, AlertTriangle, Pencil, 
  Trash, Plus, Search, X, Save
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/lib/inventoryService';
import { InventoryItem } from '@/lib/types';

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    threshold: 0,
    unit: '',
  });
  
  useEffect(() => {
    loadInventoryItems();
  }, []);
  
  const loadInventoryItems = async () => {
    setLoading(true);
    const items = await getInventoryItems();
    setInventoryItems(items);
    setLoading(false);
  };
  
  const filteredItems = searchQuery.trim() 
    ? inventoryItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : inventoryItems;
    
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.threshold);
  
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.unit) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }
    
    const item = await addInventoryItem(newItem);
    if (item) {
      setInventoryItems([...inventoryItems, item]);
      setNewItem({
        name: '',
        quantity: 0,
        threshold: 0,
        unit: '',
      });
      setIsAddDialogOpen(false);
      toast.success('Producto agregado con éxito');
    }
  };
  
  const handleEditItem = async () => {
    if (!currentItem) return;
    
    const success = await updateInventoryItem(currentItem);
    if (success) {
      setInventoryItems(
        inventoryItems.map(item => item.id === currentItem.id ? currentItem : item)
      );
      setIsEditDialogOpen(false);
      toast.success('Producto actualizado con éxito');
    }
  };
  
  const handleDeleteItem = async () => {
    if (!currentItem) return;
    
    const success = await deleteInventoryItem(currentItem.id);
    if (success) {
      setInventoryItems(
        inventoryItems.filter(item => item.id !== currentItem.id)
      );
      setIsDeleteDialogOpen(false);
      toast.success('Producto eliminado con éxito');
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
                <span>Volver</span>
              </Link>
              <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
            </div>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </header>
          
          {lowStockItems.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                <AlertTriangle className="h-5 w-5" />
                <h3>Productos con Bajo Stock</h3>
              </div>
              
              <div className="space-x-2">
                {lowStockItems.map(item => (
                  <span key={item.id} className="inline-block bg-white border border-red-200 text-red-700 text-sm px-2 py-1 rounded">
                    {item.name}: {item.quantity} {item.unit}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-2 top-2.5 text-muted-foreground"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Cargando...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium text-lg mb-1">No hay productos</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? "No se encontraron productos que coincidan con la búsqueda." 
                      : "Agregue productos para comenzar a gestionar su inventario."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Stock Mínimo</TableHead>
                      <TableHead>Última Actualización</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <span className="text-blue-600 mr-2">
                              <Package className="h-4 w-4" />
                            </span>
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={item.quantity <= item.threshold ? "text-red-600 font-medium" : ""}>
                            {item.quantity} {item.unit}
                          </span>
                        </TableCell>
                        <TableCell>{item.threshold} {item.unit}</TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-blue-600"
                              onClick={() => {
                                setCurrentItem(item);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-600"
                              onClick={() => {
                                setCurrentItem(item);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Stock Mínimo</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  value={newItem.threshold}
                  onChange={(e) => setNewItem({...newItem, threshold: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad</Label>
              <Input
                id="unit"
                value={newItem.unit}
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                placeholder="kg, litros, unidades, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre del Producto</Label>
                <Input
                  id="edit-name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Cantidad</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-threshold">Stock Mínimo</Label>
                  <Input
                    id="edit-threshold"
                    type="number"
                    min="0"
                    value={currentItem.threshold}
                    onChange={(e) => setCurrentItem({...currentItem, threshold: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unidad</Label>
                <Input
                  id="edit-unit"
                  value={currentItem.unit}
                  onChange={(e) => setCurrentItem({...currentItem, unit: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleEditItem}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Está seguro de que desea eliminar el producto 
            <span className="font-semibold"> {currentItem?.name}</span>?
            Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteItem}>
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
