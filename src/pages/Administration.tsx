
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, History } from "lucide-react";
import { ResetCountersPage } from '@/components/admin/ResetCountersPage';
import { SystemVersion } from '@/components/admin/SystemVersion';
import { SystemVersions } from '@/components/admin/SystemVersions';

const Administration = () => {
  const [activeSection, setActiveSection] = useState<string | null>("system_version");

  // Función para renderizar el contenido basado en la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'system_version':
        return <SystemVersion />;
      case 'reset_counters':
        return <ResetCountersPage />;
      case 'system_versions':
        return <SystemVersions />;
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Administración</h1>
      
      <div className="flex flex-col md:flex-row gap-6 h-full">
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
        </div>
        
        <div className="flex-1 bg-card p-6 rounded-lg border">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Administration;
