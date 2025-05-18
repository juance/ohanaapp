
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, FrownIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <FrownIcon className="h-12 w-12 text-blue-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Página no encontrada</h1>
        <p className="text-gray-600 mb-6">La página que estás buscando no existe o ha sido movida.</p>
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            Volver al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
