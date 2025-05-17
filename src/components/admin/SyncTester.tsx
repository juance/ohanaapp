
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { testSync, cleanupSyncTest } from '@/lib/tests/syncTester';
import { syncAllData } from '@/lib/data/sync/comprehensiveSync';

export function SyncTester() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);

  const runTest = async () => {
    if (testing) return;
    
    setTesting(true);
    try {
      const testResults = await testSync();
      setResults(testResults);
      
      if (testResults.success) {
        toast.success('Sync test completed successfully');
      } else {
        toast.error('Sync test failed');
      }
    } catch (error) {
      console.error('Error running sync test:', error);
      toast.error('Error running sync test');
    } finally {
      setTesting(false);
    }
  };

  const cleanup = async () => {
    try {
      await cleanupSyncTest();
      setResults(null);
      toast.success('Test data cleaned up');
    } catch (error) {
      console.error('Error cleaning up:', error);
      toast.error('Error cleaning up test data');
    }
  };

  const runSync = async () => {
    if (syncing) return;
    
    setSyncing(true);
    try {
      const syncResults = await syncAllData(true);
      
      toast.success(`Sync completed: ${
        syncResults.tickets + 
        syncResults.expenses + 
        syncResults.clients + 
        syncResults.feedback
      } items synced`);
    } catch (error) {
      console.error('Error running sync:', error);
      toast.error('Error running sync');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tester de Sincronización</CardTitle>
        <CardDescription>
          Comprueba que el sistema de sincronización funciona correctamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button 
            onClick={runTest} 
            disabled={testing}
            className="w-full"
          >
            {testing ? 'Probando...' : 'Probar sincronización'}
          </Button>
          
          <Button 
            onClick={runSync} 
            disabled={syncing}
            variant="outline"
            className="w-full"
          >
            {syncing ? 'Sincronizando...' : 'Forzar sincronización'}
          </Button>
          
          {results && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="border rounded p-2">
                  <h3 className="text-sm font-medium">Tickets</h3>
                  <p className="text-2xl">{results.results.syncResults.tickets}</p>
                </div>
                <div className="border rounded p-2">
                  <h3 className="text-sm font-medium">Gastos</h3>
                  <p className="text-2xl">{results.results.syncResults.expenses}</p>
                </div>
                <div className="border rounded p-2">
                  <h3 className="text-sm font-medium">Clientes</h3>
                  <p className="text-2xl">{results.results.syncResults.clients}</p>
                </div>
                <div className="border rounded p-2">
                  <h3 className="text-sm font-medium">Feedback</h3>
                  <p className="text-2xl">{results.results.syncResults.feedback}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 justify-center">
                <span className={`text-lg font-medium ${results.success ? 'text-green-600' : 'text-red-600'}`}>
                  {results.success ? '✓ Prueba exitosa' : '✗ Prueba fallida'}
                </span>
                <Button onClick={cleanup} variant="ghost" size="sm">
                  Limpiar datos de prueba
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start text-sm text-gray-500">
        <p>Este componente crea datos de prueba y verifica la sincronización.</p>
        <p>Solo use para fines de prueba, no en producción.</p>
      </CardFooter>
    </Card>
  );
}
