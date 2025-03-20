
import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InventoryList from '@/components/InventoryList';
import { toast } from 'sonner';

const Inventory = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver</span>
            </Link>
            <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
            <p className="text-gray-500">Administre los suministros de lavandería</p>
          </header>
          
          <InventoryList />
        </div>
      </div>
    </div>
  );
};

export default Inventory;
