
import React from 'react';
import { Package } from 'lucide-react';

interface EmptyInventoryProps {
  searchQuery: string;
}

const EmptyInventory: React.FC<EmptyInventoryProps> = ({ searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="font-medium text-lg mb-1">No hay productos</h3>
      <p className="text-muted-foreground">
        {searchQuery 
          ? "No se encontraron productos que coincidan con la búsqueda." 
          : "Agregue productos para comenzar a gestionar su inventario."}
      </p>
    </div>
  );
};

export default EmptyInventory;
