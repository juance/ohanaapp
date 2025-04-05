import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  resetCounters,
  resetDashboardCounters,
  resetClientCounters,
  resetLoyaltyCounters,
  resetMetricsCounters,
  resetTicketAnalysisCounters
} from '@/lib/resetCountersService';

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
      let success = true;
      const resetOperations = [];

      // Perform resets based on selected sections
      if (selectedSections.dashboard) {
        resetOperations.push(resetDashboardCounters());
      }
      
      if (selectedSections.clients) {
        resetOperations.push(resetClientCounters());
      }
      
      if (selectedSections.loyalty) {
        resetOperations.push(resetLoyaltyCounters());
      }
      
      if (selectedSections.metrics) {
        resetOperations.push(resetMetricsCounters());
      }
      
      if (selectedSections.ticketAnalysis) {
        resetOperations.push(resetTicketAnalysisCounters());
      }

      // Wait for all reset operations to complete
      const results = await Promise.all(resetOperations);
      
      // Check if any operation failed
      if (results.includes(false)) {
        success = false;
      }

      if (success) {
        toast.success("Contadores reiniciados", {
          description: "Los contadores han sido reiniciados exitosamente."
        });

        // Refresh the page after a short delay to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Error al reiniciar contadores", {
          description: "Algunos contadores no pudieron ser reiniciados."
        });
      }
    } catch (error) {
      console.error('Error resetting counters:', error);
      toast.error("Error al reiniciar contadores", {
        description: "Ocurrió un error al reiniciar los contadores."
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
    <Card className="border-amber-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-amber-600 flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Reiniciar Contadores
        </CardTitle>
        <CardDescription>
          Reinicia los contadores en las secciones seleccionadas como si la aplicación estuviera recién construida.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="default" 
              className="w-full bg-amber-500 hover:bg-amber-600"
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
      </CardFooter>
    </Card>
  );
};
