
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { History, RotateCcw } from "lucide-react";
import { SystemVersionInfo } from "./SystemVersionInfo";
import { ResetCounters } from "./ResetCounters";

export const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <History className="h-5 w-5 text-blue-500 mr-2" />
            <CardTitle>Control de Versiones</CardTitle>
          </div>
          <CardDescription>
            Historial de cambios del sistema y restauración de versiones anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemVersionInfo />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <RotateCcw className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle>Reiniciar Contadores</CardTitle>
          </div>
          <CardDescription>
            Reinicia los contadores en las secciones seleccionadas como si la aplicación estuviera recién construida
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetCounters />
        </CardContent>
      </Card>
    </div>
  );
};
