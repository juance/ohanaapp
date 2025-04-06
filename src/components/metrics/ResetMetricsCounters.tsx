
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { RotateCcw } from "lucide-react";
import { resetMetricsCounters } from '@/lib/resetMetricsService';
import { MetricsCheckboxes } from './counters/MetricsCheckboxes';
import { MetricsInfoWarning } from './counters/MetricsInfoWarning';
import { MetricsResetDialog } from './counters/MetricsResetDialog';

export const ResetMetricsCounters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<{
    tickets: boolean;
    clients: boolean;
    revenue: boolean;
    clientTypes: boolean;
  }>({
    tickets: true,
    clients: true,
    revenue: true,
    clientTypes: true
  });

  const handleResetCounters = async () => {
    setIsResetting(true);
    try {
      // Call the resetMetricsCounters function with the selected metrics
      const success = await resetMetricsCounters(selectedMetrics);

      if (success) {
        toast.success("Contadores de métricas reiniciados", {
          description: "Los contadores de métricas han sido reiniciados exitosamente."
        });

        // Refresh the page after a short delay to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Error al reiniciar contadores de métricas", {
          description: "Algunos contadores no pudieron ser reiniciados."
        });
      }
    } catch (error) {
      console.error('Error resetting metrics counters:', error);
      toast.error("Error al reiniciar contadores de métricas", {
        description: "Ocurrió un error al reiniciar los contadores de métricas."
      });
    } finally {
      setIsResetting(false);
    }
  };

  const toggleMetric = (metric: keyof typeof selectedMetrics) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const allSelected = Object.values(selectedMetrics).every(Boolean);
  const someSelected = Object.values(selectedMetrics).some(Boolean);

  const toggleAll = () => {
    const newValue = !allSelected;
    setSelectedMetrics({
      tickets: newValue,
      clients: newValue,
      revenue: newValue,
      clientTypes: newValue
    });
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-600 flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Reiniciar Contadores de Métricas
        </CardTitle>
        <CardDescription>
          Reinicia los contadores de métricas seleccionados como si la aplicación estuviera recién construida.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MetricsCheckboxes 
          selectedMetrics={selectedMetrics}
          toggleMetric={toggleMetric}
          allSelected={allSelected}
          toggleAll={toggleAll}
        />
        <MetricsInfoWarning />
      </CardContent>
      <CardFooter>
        <MetricsResetDialog 
          isResetting={isResetting}
          handleResetCounters={handleResetCounters}
          someSelected={someSelected}
        />
      </CardFooter>
    </Card>
  );
};
