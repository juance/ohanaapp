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
  ShoppingBag,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Award
} from "lucide-react";
import { resetDashboardCounters } from '@/lib/resetDashboardService';

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
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-counters"
              checked={allSelected}
              onCheckedChange={toggleAll}
            />
            <label
              htmlFor="all-counters"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Seleccionar todos los contadores
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tickets"
                checked={selectedCounters.tickets}
                onCheckedChange={() => toggleCounter('tickets')}
              />
              <label
                htmlFor="tickets"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <ShoppingBag className="h-4 w-4 text-green-500" />
                Tickets
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paidTickets"
                checked={selectedCounters.paidTickets}
                onCheckedChange={() => toggleCounter('paidTickets')}
              />
              <label
                htmlFor="paidTickets"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <CheckCircle className="h-4 w-4 text-blue-500" />
                Tickets Pagados
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="revenue"
                checked={selectedCounters.revenue}
                onCheckedChange={() => toggleCounter('revenue')}
              />
              <label
                htmlFor="revenue"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <DollarSign className="h-4 w-4 text-yellow-500" />
                Ingresos
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="expenses"
                checked={selectedCounters.expenses}
                onCheckedChange={() => toggleCounter('expenses')}
              />
              <label
                htmlFor="expenses"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <TrendingUp className="h-4 w-4 text-red-500" />
                Gastos
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="freeValets"
                checked={selectedCounters.freeValets}
                onCheckedChange={() => toggleCounter('freeValets')}
              />
              <label
                htmlFor="freeValets"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Award className="h-4 w-4 text-purple-500" />
                Valets Gratis
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <div className="text-green-800 text-sm">
            <p className="font-medium">Esta acción reiniciará:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Contadores de tickets</li>
              <li>Contadores de tickets pagados</li>
              <li>Datos de ingresos</li>
              <li>Datos de gastos</li>
              <li>Contadores de valets gratis</li>
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
              className="w-full bg-green-500 hover:bg-green-600"
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
                Esta acción reiniciará los contadores seleccionados del dashboard como si la aplicación estuviera recién construida.
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span className="text-green-800 text-sm">
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
                className="bg-green-500 hover:bg-green-600"
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
