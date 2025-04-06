import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/lib/toast";
import {
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  LayoutDashboard,
  Users,
  Award,
  BarChart,
  TicketCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ResetCounters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [selectedSections, setSelectedSections] = useState<{
    dashboard: boolean;
    clients: boolean;
    loyalty: boolean;
    metrics: boolean;
    ticketAnalysis: boolean;
  }>({
    dashboard: true,
    clients: true,
    loyalty: true,
    metrics: true,
    ticketAnalysis: true
  });

  const handleResetCounters = async () => {
    setIsResetting(true);
    try {
      // Create a payload based on selected sections
      let payload = {};
      
      if (Object.values(selectedSections).every(Boolean)) {
        // If all sections are selected, use the 'all' counter
        payload = { counter: "all" };
      } else {
        // Otherwise, reset individual sections
        const countersToReset = [];
        
        if (selectedSections.dashboard) countersToReset.push("tickets");
        if (selectedSections.clients) countersToReset.push("clients");
        if (selectedSections.loyalty) countersToReset.push("loyalty");
        
        if (countersToReset.length === 0) {
          throw new Error("No hay secciones seleccionadas para reiniciar");
        }
        
        payload = { 
          counters: countersToReset,
          options: {}
        };
      }
      
      // Call the Supabase function to reset counters
      const { data, error } = await supabase.functions.invoke("reset_counters", {
        body: payload
      });

      if (error) throw error;

      toast.success("Contadores reiniciados", {
        description: "Los contadores han sido reiniciados exitosamente."
      });

      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting counters:', error);
      toast.error("Error al reiniciar contadores", {
        description: error instanceof Error ? error.message : "Ocurrió un error al reiniciar los contadores."
      });
    } finally {
      setIsResetting(false);
    }
  };

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const allSelected = Object.values(selectedSections).every(Boolean);
  const someSelected = Object.values(selectedSections).some(Boolean);

  const toggleAll = () => {
    const newValue = !allSelected;
    setSelectedSections({
      dashboard: newValue,
      clients: newValue,
      loyalty: newValue,
      metrics: newValue,
      ticketAnalysis: newValue
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="all-sections"
          checked={allSelected}
          onCheckedChange={toggleAll}
        />
        <label
          htmlFor="all-sections"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Seleccionar todas las secciones
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dashboard"
            checked={selectedSections.dashboard}
            onCheckedChange={() => toggleSection('dashboard')}
          />
          <label
            htmlFor="dashboard"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <LayoutDashboard className="h-4 w-4 text-blue-500" />
            Dashboard
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="clients"
            checked={selectedSections.clients}
            onCheckedChange={() => toggleSection('clients')}
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
            id="loyalty"
            checked={selectedSections.loyalty}
            onCheckedChange={() => toggleSection('loyalty')}
          />
          <label
            htmlFor="loyalty"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Award className="h-4 w-4 text-yellow-500" />
            Programa de Fidelidad
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="metrics"
            checked={selectedSections.metrics}
            onCheckedChange={() => toggleSection('metrics')}
          />
          <label
            htmlFor="metrics"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <BarChart className="h-4 w-4 text-purple-500" />
            Métricas
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="ticketAnalysis"
            checked={selectedSections.ticketAnalysis}
            onCheckedChange={() => toggleSection('ticketAnalysis')}
          />
          <label
            htmlFor="ticketAnalysis"
            className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <TicketCheck className="h-4 w-4 text-red-500" />
            Análisis de Tickets
          </label>
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
        <div className="text-amber-800 text-sm">
          <p className="font-medium">Esta acción reiniciará:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Contadores de tickets y ventas</li>
            <li>Puntos de fidelidad y valets gratuitos</li>
            <li>Estadísticas y métricas</li>
            <li>Numeración de tickets</li>
          </ul>
          <p className="mt-2 font-medium">Los datos de clientes se mantendrán, pero sus contadores se reiniciarán a cero.</p>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="default"
            className="w-full bg-amber-500 hover:bg-amber-600 mt-4"
            disabled={!someSelected}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar Contadores Seleccionados
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reiniciará los contadores en las secciones seleccionadas como si la aplicación estuviera recién construida.
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <span className="text-amber-800 text-sm">
                  Esta acción no se puede deshacer. Los datos históricos se perderán.
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetCounters}
              disabled={isResetting}
              className="bg-amber-500 hover:bg-amber-600"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reiniciando...
                </>
              ) : (
                "Confirmar Reinicio"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
