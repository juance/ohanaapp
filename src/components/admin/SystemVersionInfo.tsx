
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, RefreshCw } from "lucide-react";

interface SystemVersion {
  id: string;
  version: string;
  release_date: string;
  is_active: boolean;
  changes: any[];
}

export const SystemVersionInfo = () => {
  const [versions, setVersions] = useState<SystemVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_version')
        .select('*')
        .order('release_date', { ascending: false });

      if (error) throw error;
      
      setVersions(data || []);
    } catch (error) {
      console.error("Error loading system versions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las versiones del sistema."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : versions.length > 0 ? (
        <div className="space-y-4">
          {versions.map((version) => (
            <div 
              key={version.id} 
              className={`border rounded-md p-4 ${version.is_active ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Versión {version.version}</h3>
                  <p className="text-xs text-muted-foreground">
                    Fecha: {new Date(version.release_date).toLocaleDateString()}
                  </p>
                </div>
                {version.is_active && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Actual</span>
                )}
              </div>
              
              {version.changes && version.changes.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-1">Cambios:</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    {version.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {!version.is_active && (
                <div className="mt-3 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Restaurar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No hay información de versiones disponible.
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          onClick={loadVersions}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
    </div>
  );
};
