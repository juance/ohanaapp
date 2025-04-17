
import { QuickResetButton } from './QuickResetButton';
import { ResetTicketNumbers } from './ResetTicketNumbers';
import { ResetClientCounters } from './ResetClientCounters';
import { ResetRevenueData } from './ResetRevenueData';
import { ResetAllCounters } from './ResetAllCounters';
import { ResetAllParameters } from './ResetAllParameters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

export const ResetCountersPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Reinicio de Contadores</h1>
      
      <Card className="border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Reinicio Rápido
          </CardTitle>
          <CardDescription>
            Seleccione la categoría que desea reiniciar y confirme la operación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuickResetButton />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ResetTicketNumbers />
        <ResetClientCounters />
        <ResetRevenueData />
        <ResetAllCounters />
      </div>

      <div className="mt-8">
        <ResetAllParameters />
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <h2 className="text-xl font-semibold text-amber-700 mb-2">Información Importante</h2>
        <p className="text-amber-800">
          Todas las acciones en esta página son permanentes y no pueden deshacerse.
          Por favor asegúrese de tener un respaldo de sus datos antes de realizar
          cualquier operación de reinicio.
        </p>
      </div>
    </div>
  );
};
