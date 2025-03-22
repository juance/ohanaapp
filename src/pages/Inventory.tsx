
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import InventoryList from '@/components/InventoryList';

interface InventoryProps {
  embedded?: boolean;
}

const Inventory: React.FC<InventoryProps> = ({ embedded = false }) => {
  const content = (
    <>
      {!embedded && (
        <header className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
          <p className="text-gray-500">Inventario</p>
        </header>
      )}
      
      <InventoryList />
    </>
  );
  
  if (embedded) {
    return content;
  }
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
