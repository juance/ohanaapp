
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, History, AlertTriangle, FileText } from "lucide-react";
import { ResetCountersPage } from '@/components/admin/ResetCountersPage';
import { SystemVersion } from '@/components/admin/SystemVersion';
import { SystemVersions } from '@/components/admin/SystemVersions';
import { ErrorLogList } from '@/components/admin/ErrorLogList';
import { Loading } from '@/components/ui/loading';
import Navbar from '@/components/Navbar';
import { toast } from '@/lib/toast';
import { ErrorMessage } from '@/components/ui/error-message';
import { getErrors } from '@/lib/errorService';

const Administration = () => {
  const [activeSection, setActiveSection] = useState<string | null>("system_version");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    setIsComponentMounted(true);
    
    // Load any necessary data
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        // Add any data loading logic here
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading admin data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    };
    
    loadAdminData();
    
    // Register the app is loaded for error tracking
    console.log("Administration page loaded");
    toast({
      title: "Información",
      description: "Panel de administración cargado correctamente"
    });
    
    return () => setIsComponentMounted(false);
  }, []);

  // Get system errors for display
  const systemErrors = getErrors();

  // Función para renderizar el contenido basado en la sección activa
  const renderContent = () => {
    if (error) {
      return (
        <ErrorMessage 
          title="Error al cargar datos de administración" 
          message={error.message}
          onRetry={() => window.location.reload()}
        />
      );
    }
    
    if (isLoading) {
      return <div className="flex justify-center p-6"><Loading /></div>;
    }
    
    switch (activeSection) {
      case 'system_version':
        return <SystemVersion />;
      case 'reset_counters':
        return <ResetCountersPage />;
      case 'system_versions':
        return <SystemVersions />;
      case 'error_logs':
        return <ErrorLogList errors={systemErrors} />;
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

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
          <h1 className="text-2xl font-bold mb-6">Administración</h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 space-y-2">
              <Button
                variant={activeSection === 'system_version' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setActiveSection('system_version')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Versión del Sistema
              </Button>
              <Button
                variant={activeSection === 'reset_counters' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setActiveSection('reset_counters')}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reiniciar Contadores
              </Button>
              <Button
                variant={activeSection === 'system_versions' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setActiveSection('system_versions')}
              >
                <History className="mr-2 h-4 w-4" />
                Historial de Versiones
              </Button>
              <Button
                variant={activeSection === 'error_logs' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setActiveSection('error_logs')}
                className={`w-full justify-start ${systemErrors.length > 0 ? 'animate-pulse' : ''}`}
              >
                <AlertTriangle className={`mr-2 h-4 w-4 ${systemErrors.length > 0 ? 'text-red-500' : ''}`} />
                Registro de Errores
                {systemErrors.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full px-2 text-xs">
                    {systemErrors.length}
                  </span>
                )}
              </Button>
            </div>
            
            <div className="flex-1 bg-card p-6 rounded-lg border">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
