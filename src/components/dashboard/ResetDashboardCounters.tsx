import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
      // Create payload based on selected counters
      const payload = { 
        counters: selectedCounters
      };
      
      console.log("Sending reset counters payload:", payload);
      
      // Call the Supabase function to reset counters
      const { data, error } = await supabase.functions.invoke("reset_counters", {
        body: payload
      });

      if (error) {
        console.error("Error from reset_counters function:", error);
        throw error;
      }

      console.log("Reset counters response:", data);

      toast({
        title: "Contadores del dashboard reiniciados",
        description: "Los contadores del dashboard han sido reiniciados exitosamente."
      });

      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting dashboard counters:', error);
      toast({
        title: "Error al reiniciar contadores del dashboard",
        description: error instanceof Error ? error.message : "Ocurrió un error al reiniciar los contadores del dashboard."
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
