
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { InventoryItem } from '@/lib/types';

interface LowStockAlertProps {
  lowStockItems: InventoryItem[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockItems }) => {
  if (lowStockItems.length === 0) return null;
  
  return (
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
  );
};

export default LowStockAlert;
