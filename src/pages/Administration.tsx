import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataReset from '@/components/admin/DataReset';
import { Badge } from '@/components/ui/badge';

const Administration = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
              <div className="flex items-center">
                <p className="text-gray-500">Administración</p>
                <Badge variant="destructive" className="ml-2">Área Restringida</Badge>
              </div>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Herramientas de Administración</h2>
            </div>
            
            <div className="md:col-span-2">
              <DataReset />
            </div>
            
            <div>
              {/* Additional admin tools can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
