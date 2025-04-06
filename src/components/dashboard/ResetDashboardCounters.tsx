
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { RotateCcw } from "lucide-react";
import { resetDashboardCounters } from '@/lib/resetDashboardService';
import { CounterCheckboxes } from './counters/CounterCheckboxes';
import { InfoWarning } from './counters/InfoWarning';
import { ResetConfirmDialog } from './counters/ResetConfirmDialog';

export const ResetDashboardCounters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [selectedCounters, setSelectedCounters] = useState<{
    tickets: boolean;
    paidTickets: boolean;
    revenue: boolean;
    expenses: boolean;
    freeValets: boolean;
  }>({
    tickets: true,
    paidTickets: true,
    revenue: true,
    expenses: true,
    freeValets: true
  });

  const handleResetCounters = async () => {
    setIsResetting(true);
    try {
      // Call the resetDashboardCounters function with the selected counters
      const success = await resetDashboardCounters(selectedCounters);

      if (success) {
        toast.success("Contadores del dashboard reiniciados", {
          description: "Los contadores del dashboard han sido reiniciados exitosamente."
        });

        // Refresh the page after a short delay to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Error al reiniciar contadores del dashboard", {
          description: "Algunos contadores no pudieron ser reiniciados."
        });
      }
    } catch (error) {
      console.error('Error resetting dashboard counters:', error);
      toast.error("Error al reiniciar contadores del dashboard", {
        description: "Ocurrió un error al reiniciar los contadores del dashboard."
      });
    } finally {
      setIsResetting(false);
    }
  };

  const toggleCounter = (counter: keyof typeof selectedCounters) => {
    setSelectedCounters(prev => ({
      ...prev,
      [counter]: !prev[counter]
    }));
  };

  const allSelected = Object.values(selectedCounters).every(Boolean);
  const someSelected = Object.values(selectedCounters).some(Boolean);

  const toggleAll = () => {
    const newValue = !allSelected;
    setSelectedCounters({
      tickets: newValue,
      paidTickets: newValue,
      revenue: newValue,
      expenses: newValue,
      freeValets: newValue
    });
  };

  return (
    <Card className="border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-600 flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Reiniciar Contadores del Dashboard
        </CardTitle>
        <CardDescription>
          Reinicia los contadores seleccionados del panel de control como si la aplicación estuviera recién construida.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CounterCheckboxes 
          selectedCounters={selectedCounters}
          toggleCounter={toggleCounter}
          allSelected={allSelected}
          toggleAll={toggleAll}
        />
        <InfoWarning />
      </CardContent>
      <CardFooter>
        <ResetConfirmDialog 
          isResetting={isResetting}
          handleResetCounters={handleResetCounters}
          someSelected={someSelected}
        />
      </CardFooter>
    </Card>
  );
};
