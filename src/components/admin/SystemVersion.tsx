
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Check, Info } from "lucide-react";

export const SystemVersion = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Versión del Sistema</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Versión Actual: 1.0.0</CardTitle>
          <CardDescription>
            Fecha de lanzamiento: 6 de abril de 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Esta es la versión inicial del sistema de Lavandería Ohana.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h3 className="font-medium">Cambios en esta versión:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                  <span>Implementación del sistema de tickets</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                  <span>Gestión de clientes y su historial</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                  <span>Sistema de lealtad con valets gratuitos</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                  <span>Panel de administración para reiniciar contadores</span>
                </li>
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
