
import React from 'react';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  // Usamos window.location para navegación directa sin hooks
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-blue-600 mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
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
