
import React, { useState, useEffect } from 'react';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { Loading } from '@/components/ui/loading';
import Navbar from '@/components/Navbar';
import { toast } from '@/lib/toast';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Administration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("general");

  useEffect(() => {
    setIsComponentMounted(true);
    
    // Load any necessary data
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        // Add any data loading logic here
        
        // Set loading to false after a short delay to ensure UI renders
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } catch (err) {
        console.error("Error loading admin data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    };
    
    loadAdminData();
    
    return () => setIsComponentMounted(false);
  }, []);

  if (!isComponentMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto">
          <div className="mb-6">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Administración</h1>
            <p className="text-gray-500">Gestión y configuración del sistema</p>
          </div>
          
          {error ? (
            <ErrorMessage 
              title="Error al cargar datos de administración" 
              message={error.message}
              onRetry={() => window.location.reload()}
            />
          ) : isLoading ? (
            <div className="flex justify-center p-6"><Loading /></div>
          ) : (
            <AdminTabs defaultTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Administration;
