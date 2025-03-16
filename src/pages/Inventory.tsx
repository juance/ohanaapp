
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import InventoryItem from '@/components/InventoryItem';
import { getCurrentUser, hasPermission } from '@/lib/auth';
import { InventoryItem as InventoryItemType } from '@/lib/types';
import { toast } from 'sonner';
import { Search, Plus, Package } from 'lucide-react';

// Mock inventory data
const mockInventory: InventoryItemType[] = [
  { id: '1', name: 'Detergent', quantity: 20, threshold: 10, unit: 'liters' },
  { id: '2', name: 'Fabric Softener', quantity: 15, threshold: 8, unit: 'liters' },
  { id: '3', name: 'Bleach', quantity: 5, threshold: 10, unit: 'liters' },
  { id: '4', name: 'Stain Remover', quantity: 8, threshold: 6, unit: 'bottles' },
  { id: '5', name: 'Laundry Bags', quantity: 50, threshold: 30, unit: 'pieces' },
  { id: '6', name: 'Hangers', quantity: 75, threshold: 50, unit: 'pieces' },
];

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItemType[]>(mockInventory);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItemType[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    threshold: 0,
    unit: '',
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      
      if (!user) {
        navigate('/');
        return;
      }
      
      if (!hasPermission(user, ['admin'])) {
        navigate('/dashboard');
        toast.error('Access denied', {
          description: 'You do not have permission to access this page',
        });
        return;
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredInventory(inventory.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.unit.toLowerCase().includes(query)
      ));
    } else {
      setFilteredInventory(inventory);
    }
  }, [searchQuery, inventory]);
  
  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };
  
  const handleUpdateItem = (updatedItem: InventoryItemType) => {
    setInventory(inventory.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    
    toast.success('Item updated', {
      description: `${updatedItem.name} has been updated`,
    });
  };
  
  const handleAddItem = () => {
    if (!newItem.name || !newItem.unit) {
      toast.error('Missing information', {
        description: 'Please provide a name and unit for the new item',
      });
      return;
    }
    
    const newId = `${inventory.length + 1}`;
    const item: InventoryItemType = {
      id: newId,
      ...newItem,
    };
    
    setInventory([...inventory, item]);
    setNewItem({
      name: '',
      quantity: 0,
      threshold: 0,
      unit: '',
    });
    setIsAddingItem(false);
    
    toast.success('Item added', {
      description: `${newItem.name} has been added to inventory`,
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="mt-1 text-muted-foreground">
              Manage laundry supplies and inventory items
            </p>
          </div>
          
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddingItem(true)}
              className="bg-laundry-500 hover:bg-laundry-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {isAddingItem && (
            <Card className="mb-6 animate-scale-in border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Add New Inventory Item</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unit</label>
                    <Input
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      placeholder="e.g. liters, pieces"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Quantity</label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Low Stock Threshold</label>
                    <Input
                      type="number"
                      value={newItem.threshold}
                      onChange={(e) => setNewItem({ ...newItem, threshold: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingItem(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddItem}
                  className="bg-laundry-500 hover:bg-laundry-600"
                >
                  Add Item
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {filteredInventory.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No items found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Start by adding some inventory items'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsAddingItem(true)}
                  className="mt-4 bg-laundry-500 hover:bg-laundry-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredInventory.map((item) => (
                <InventoryItem
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  onUpdate={handleUpdateItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
