
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PickupHeader: React.FC = () => {
  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
          <ArrowLeft className="mr-1 h-4 w-4" />
          <span>Volver al Inicio</span>
        </Link>
        <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
        <p className="text-gray-500">Sistema de Tickets</p>
      </div>
    </header>
  );
};

export default PickupHeader;
