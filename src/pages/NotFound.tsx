
import React from 'react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const handleGoHome = () => {
    // Use direct navigation instead of React Router hooks
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-medium mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button 
          onClick={handleGoHome}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
