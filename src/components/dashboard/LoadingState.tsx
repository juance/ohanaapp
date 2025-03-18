
import React from 'react';
import Navbar from '@/components/Navbar';

const LoadingState: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Cargando métricas...</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
