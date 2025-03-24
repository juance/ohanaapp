
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ClientHeader = () => {
  return (
    <header className="mb-8">
      <Link to="/" className="mb-2 flex items-center text-blue-600 hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Volver al Inicio</span>
      </Link>
      <h1 className="text-2xl font-bold text-blue-600">Clientes</h1>
      <p className="text-gray-500">Administra y consulta información de clientes</p>
    </header>
  );
};

export default ClientHeader;
