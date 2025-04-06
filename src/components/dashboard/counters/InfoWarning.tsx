
import React from 'react';
import { AlertTriangle } from "lucide-react";

export const InfoWarning: React.FC = () => {
  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
      <AlertTriangle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
      <div className="text-green-800 text-sm">
        <p className="font-medium">Esta acción reiniciará:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Contadores de tickets y ventas en el dashboard</li>
          <li>Estado de pago de tickets</li>
          <li>Ingresos registrados</li>
          <li>Gastos registrados</li>
          <li>Valets gratuitos asignados a clientes</li>
        </ul>
        <p className="mt-2 font-medium">Los datos de clientes se mantendrán, pero los contadores relacionados se reiniciarán a cero.</p>
      </div>
    </div>
  );
};
