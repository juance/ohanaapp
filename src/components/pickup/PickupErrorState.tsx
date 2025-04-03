
import React from 'react';
import Navbar from '@/components/Navbar';

interface PickupErrorStateProps {
  onRetry: () => void;
}

const PickupErrorState: React.FC<PickupErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error al cargar los tickets. Por favor, intente de nuevo.</p>
          <button 
            onClick={onRetry} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupErrorState;
