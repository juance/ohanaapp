import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Check, Info } from "lucide-react";
import { getCurrentVersion } from '@/lib/systemVersionService';
import { SystemChange } from '@/hooks/useSystemVersions';

export const SystemVersion = () => {
  const [version, setVersion] = useState("1.0.0");
  const [releaseDate, setReleaseDate] = useState("6 de abril de 2025");
  const [changes, setChanges] = useState<SystemChange[]>([
    { type: 'feature', title: "Implementación del sistema de tickets", description: "" },
    { type: 'feature', title: "Gestión de clientes y su historial", description: "" },
    { type: 'feature', title: "Sistema de lealtad con valets gratuitos", description: "" },
    { type: 'feature', title: "Panel de administración para reiniciar contadores", description: "" }
  ]);

  useEffect(() => {
    const fetchCurrentVersion = async () => {
      try {
        const versionData = await getCurrentVersion();
        if (versionData) {
          setVersion(versionData.version);
          
          // Format the date for display
          const date = new Date(versionData.releaseDate);
          setReleaseDate(date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }));
          
          // Set changes if available
          if (versionData.changes && versionData.changes.length > 0) {
            setChanges(versionData.changes);
          }
        }
      } catch (error) {
        console.error("Error fetching system version:", error);
        // Keep default values if fetching fails
      }
    };
    
    fetchCurrentVersion();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Versión del Sistema</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Versión Actual: {version}</CardTitle>
          <CardDescription>
            Fecha de lanzamiento: {releaseDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Esta es la versión actual del sistema de Lavandería Ohana.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h3 className="font-medium">Cambios en esta versión:</h3>
              <ul className="space-y-2">
                {changes.map((change, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                    <span>{change.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <p className="text-sm text-gray-500">
              Para obtener más información sobre esta versión o reportar problemas, 
              contacte al equipo de soporte técnico.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
