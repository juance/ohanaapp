
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { InventoryList } from '@/components/InventoryList';

const Inventory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventario</h1>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Agregar Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos en Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Buscar productos..." />
            </div>
          </div>
          
          <InventoryList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
