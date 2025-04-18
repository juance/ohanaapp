
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { History } from "lucide-react";
import { SystemVersionInfo } from "./SystemVersionInfo";

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


    </div>
  );
};
