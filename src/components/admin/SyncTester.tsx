
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { testSync, cleanupSyncTest } from '@/lib/tests/syncTester';

export function SyncTester() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; results: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunTest = async () => {
    try {
      setIsRunning(true);
      setError(null);
      
      const result = await testSync();
      setTestResult(result);
      
      // Clean up test data after running the test
      await cleanupSyncTest();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error running sync test');
      console.error('Error running sync test:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Prueba de Sincronización</span>
          {testResult && (
            testResult.success 
              ? <CheckCircle2 className="h-5 w-5 text-green-500" /> 
              : <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>
          Verifica que el sistema de sincronización de datos esté funcionando correctamente
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {testResult && (
          <div className="text-sm space-y-2">
            <h3 className="font-medium">Resultados:</h3>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="mb-1 text-xs font-medium">Estado inicial:</p>
              <ul className="list-disc pl-5 text-xs">
                <li>Tickets: {testResult.results.initialState.tickets}</li>
                <li>Gastos: {testResult.results.initialState.expenses}</li>
                <li>Clientes: {testResult.results.initialState.clients}</li>
                <li>Feedback: {testResult.results.initialState.feedback}</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="mb-1 text-xs font-medium">Datos de prueba creados:</p>
              <ul className="list-disc pl-5 text-xs">
                <li>Ticket: {testResult.results.testCreation.ticket ? 'Sí' : 'No'}</li>
                <li>Gasto: {testResult.results.testCreation.expense ? 'Sí' : 'No'}</li>
                <li>Cliente: {testResult.results.testCreation.client ? 'Sí' : 'No'}</li>
                <li>Feedback: {testResult.results.testCreation.feedback ? 'Sí' : 'No'}</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="mb-1 text-xs font-medium">Resultados de sincronización:</p>
              <ul className="list-disc pl-5 text-xs">
                <li>Tickets: {testResult.results.syncResults.tickets}</li>
                <li>Gastos: {testResult.results.syncResults.expenses}</li>
                <li>Clientes: {testResult.results.syncResults.clients}</li>
                <li>Feedback: {testResult.results.syncResults.feedback}</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleRunTest} 
          disabled={isRunning}
          variant="outline"
          className="gap-2"
        >
          {isRunning && <RefreshCw className="h-4 w-4 animate-spin" />}
          {isRunning ? 'Ejecutando...' : 'Ejecutar prueba de sincronización'}
        </Button>
      </CardFooter>
    </Card>
  );
}
