
import React from 'react';
import { AlertTriangle } from "lucide-react";

export const MetricsInfoWarning: React.FC = () => {
  return (
    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
      <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
      <div className="text-blue-800 text-sm">
        <p className="font-medium">Esta acción reiniciará:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Contadores de tickets</li>
          <li>Contadores de clientes</li>
          <li>Datos de ingresos por día</li>
          <li>Distribución de tipos de clientes</li>
        </ul>
        <p className="mt-2 font-medium">Los datos de clientes se mantendrán, pero sus contadores se reiniciarán a cero.</p>
      </div>
    </div>
  );
};
