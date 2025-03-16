
import { useState } from 'react';
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
  Trash, Plus 
} from 'lucide-react';
import { toast } from 'sonner';

// Mock inventory data
const mockInventory = [
  { id: '1', name: 'Skip', quantity: '10 kg', minStock: '2 kg', lastUpdated: '13 de mar de 2025' },
  { id: '2', name: 'Vinagre', quantity: '5', minStock: '1', lastUpdated: '13 de mar de 2025' },
  { id: '3', name: 'Bolsas camiseta', quantity: '100 unidades', minStock: '20 unidades', lastUpdated: '13 de mar de 2025' },
  { id: '4', name: 'Bolsas acolchado', quantity: '50 unidades', minStock: '10 unidades', lastUpdated: '13 de mar de 2025' },
  { id: '5', name: 'Perfumina', quantity: '3 L', minStock: '1 L', lastUpdated: '13 de mar de 2025' },
  { id: '6', name: 'Desengrasante', quantity: '2 L', minStock: '1 L', lastUpdated: '13 de mar de 2025' },
  { id: '7', name: 'Bactericida', quantity: '2 L', minStock: '1 L', lastUpdated: '13 de mar de 2025' },
  { id: '8', name: 'Bolsas', quantity: '20 unidades', minStock: '5 unidades', lastUpdated: '13 de mar de 2025' },
  { id: '9', name: 'Quita sangre', quantity: '1 L', minStock: '1 L', lastUpdated: '13 de mar de 2025' },
  { id: '10', name: 'Quitamanchas', quantity: '2 L', minStock: '1 L', lastUpdated: '13 de mar de 2025' }
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredItems = searchQuery.trim() 
    ? mockInventory.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockInventory;
    
  const lowStockItems = mockInventory.filter(item => {
    // Simple check for low stock
    const itemQuantity = parseInt(item.quantity);
    const itemMinStock = parseInt(item.minStock);
    if (!isNaN(itemQuantity) && !isNaN(itemMinStock)) {
      return itemQuantity <= itemMinStock;
    }
    return false;
  });
  
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
            
            <Button className="bg-blue-600 hover:bg-blue-700">
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
                    {item.name}: {item.quantity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <Card>
            <CardContent className="p-0">
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
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.minStock}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
