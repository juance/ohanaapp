
import { useState, useEffect } from 'react';
import { getInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/lib/inventoryService';
import { InventoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Import the new components
import SearchBar from './inventory/SearchBar';
import LowStockAlert from './inventory/LowStockAlert';
import EmptyInventory from './inventory/EmptyInventory';
import AddItemDialog from './inventory/AddItemDialog';
import EditItemDialog from './inventory/EditItemDialog';
import DeleteItemDialog from './inventory/DeleteItemDialog';
import InventoryTable from './inventory/InventoryTable';

const InventoryList = () => {
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
    }
  };
  
  const handleEditItemClick = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteItemClick = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <LowStockAlert lowStockItems={lowStockItems} />
      
      <div className="flex justify-between items-center">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <p>Cargando...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyInventory searchQuery={searchQuery} />
          ) : (
            <InventoryTable 
              items={filteredItems} 
              onEdit={handleEditItemClick}
              onDelete={handleDeleteItemClick}
            />
          )}
        </CardContent>
      </Card>
      
      <AddItemDialog 
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAddItem={handleAddItem}
      />
      
      <EditItemDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        handleEditItem={handleEditItem}
      />
      
      <DeleteItemDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        currentItem={currentItem}
        handleDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default InventoryList;
