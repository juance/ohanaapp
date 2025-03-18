
import React from 'react';
import Navbar from '@/components/Navbar';

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  fullPage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  title = "Dashboard", 
  subtitle = "Cargando métricas...",
  fullPage = true
}) => {
  if (!fullPage) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-40">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
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
