
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingBag,
  Users,
  LineChart,
  BarChart
} from "lucide-react";

interface MetricsCheckboxesProps {
  selectedMetrics: {
    tickets: boolean;
    clients: boolean;
    revenue: boolean;
    clientTypes: boolean;
  };
  toggleMetric: (metric: keyof typeof selectedMetrics) => void;
  allSelected: boolean;
  toggleAll: () => void;
}

export const MetricsCheckboxes: React.FC<MetricsCheckboxesProps> = ({
  selectedMetrics,
  toggleMetric,
  allSelected,
  toggleAll
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="all-metrics"
          checked={allSelected}
          onCheckedChange={toggleAll}
        />
        <label
          htmlFor="all-metrics"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Seleccionar todas las métricas
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tickets"
            checked={selectedMetrics.tickets}
            onCheckedChange={() => toggleMetric('tickets')}
          />
          <label
            htmlFor="tickets"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <ShoppingBag className="h-4 w-4 text-blue-500" />
            Tickets
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="clients"
            checked={selectedMetrics.clients}
            onCheckedChange={() => toggleMetric('clients')}
          />
          <label
            htmlFor="clients"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Users className="h-4 w-4 text-green-500" />
            Clientes
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="revenue"
            checked={selectedMetrics.revenue}
            onCheckedChange={() => toggleMetric('revenue')}
          />
          <label
            htmlFor="revenue"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <LineChart className="h-4 w-4 text-yellow-500" />
            Ingresos por Día
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="clientTypes"
            checked={selectedMetrics.clientTypes}
            onCheckedChange={() => toggleMetric('clientTypes')}
          />
          <label
            htmlFor="clientTypes"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <BarChart className="h-4 w-4 text-purple-500" />
            Tipos de Clientes
          </label>
        </div>
      </div>
    </div>
  );
};
