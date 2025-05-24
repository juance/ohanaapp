
import React from 'react';
import { toast } from '@/lib/toast';

const Dashboard = () => {
  const handleAction = () => {
    toast({
      title: "Acción completada",
      description: "La acción se ejecutó correctamente"
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button onClick={handleAction} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Acción de prueba
      </button>
    </div>
  );
};

export default Dashboard;
