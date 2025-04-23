
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { History, FileText } from "lucide-react";
import { SystemVersionInfo } from "./SystemVersionInfo";
import { Link } from "react-router-dom";

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
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <CardTitle>Documentación del Código</CardTitle>
          </div>
          <CardDescription>
            Documentación técnica detallada sobre la estructura y funcionamiento del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Acceda a la documentación técnica completa del sistema para comprender mejor su arquitectura, 
            componentes, servicios y estructura de base de datos.
          </p>
          <Link to="/code-documentation">
            <Button className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Ver Documentación Técnica
            </Button>
          </Link>
        </CardContent>
      </Card>

    </div>
  );
};
