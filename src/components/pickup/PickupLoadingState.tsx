
import React from 'react';
import Navbar from '@/components/Navbar';

const PickupLoadingState: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64 p-6 flex items-center justify-center">
        <p>Cargando tickets...</p>
      </div>
    </div>
  );
};

export default PickupLoadingState;
