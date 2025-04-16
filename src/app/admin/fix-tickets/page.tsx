'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { migrateAllTicketsWithoutServices, fixTicketByNumber } from '@/lib/services/ticketMigrationService';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function FixTicketsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [isFixingTicket, setIsFixingTicket] = useState(false);
  const [ticketResult, setTicketResult] = useState<{success: boolean, message: string} | null>(null);

  const handleMigrateAll = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setResult(null);
    
    try {
      const migratedCount = await migrateAllTicketsWithoutServices();
      setResult(`Se migraron ${migratedCount} tickets correctamente.`);
      toast.success(`Migración completada: ${migratedCount} tickets actualizados`);
    } catch (error) {
      console.error('Error en la migración:', error);
      setResult('Error al migrar tickets. Consulta la consola para más detalles.');
      toast.error('Error al migrar tickets');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFixTicket = async () => {
    if (isFixingTicket || !ticketNumber) return;
    
    setIsFixingTicket(true);
    setTicketResult(null);
    
    try {
      const success = await fixTicketByNumber(ticketNumber);
      
      if (success) {
        setTicketResult({
          success: true,
          message: `Ticket #${ticketNumber} corregido correctamente.`
        });
        toast.success(`Ticket #${ticketNumber} corregido`);
      } else {
        setTicketResult({
          success: false,
          message: `No se pudo corregir el ticket #${ticketNumber}.`
        });
        toast.error(`No se pudo corregir el ticket #${ticketNumber}`);
      }
    } catch (error) {
      console.error(`Error al corregir ticket #${ticketNumber}:`, error);
      setTicketResult({
        success: false,
        message: `Error al corregir el ticket #${ticketNumber}.`
      });
      toast.error(`Error al corregir el ticket #${ticketNumber}`);
    } finally {
      setIsFixingTicket(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Herramientas de Corrección de Tickets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Corregir Todos los Tickets</CardTitle>
            <CardDescription>
              Esta herramienta migrará todos los tickets que no tienen servicios registrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Al hacer clic en el botón, se verificarán todos los tickets y se crearán servicios por defecto para aquellos que no tengan.
            </p>
            {result && (
              <div className={`p-3 rounded-md ${result.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {result}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleMigrateAll} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Corregir Todos los Tickets'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Corregir Ticket Específico</CardTitle>
            <CardDescription>
              Corrige un ticket específico por su número.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Número de ticket (ej: 00000038)"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  disabled={isFixingTicket}
                />
                <Button 
                  onClick={handleFixTicket} 
                  disabled={isFixingTicket || !ticketNumber}
                >
                  {isFixingTicket ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    'Corregir'
                  )}
                </Button>
              </div>
              
              {ticketResult && (
                <div className={`p-3 rounded-md flex items-center ${ticketResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {ticketResult.success ? (
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  {ticketResult.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-8" />
      
      <div className="bg-blue-50 p-4 rounded-md">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">Instrucciones</h2>
        <ul className="list-disc pl-5 space-y-1 text-blue-700">
          <li>Usa "Corregir Todos los Tickets" para arreglar automáticamente todos los tickets sin servicios.</li>
          <li>Usa "Corregir Ticket Específico" si tienes un ticket específico que necesita ser arreglado.</li>
          <li>Después de corregir un ticket, actualiza la página donde se muestra el ticket para ver los cambios.</li>
        </ul>
      </div>
    </div>
  );
}
