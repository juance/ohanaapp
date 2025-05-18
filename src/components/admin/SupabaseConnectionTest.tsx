
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { AlertTriangle, CheckCircle, Database, ExternalLink, RefreshCw, Server } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SupabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTestingFunction, setIsTestingFunction] = useState(false);

  const testDirectConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test direct connection
      const { data: directData, error: directError } = await supabase
        .from('ticket_sequence')
        .select('last_number')
        .limit(1);

      if (directError) {
        throw new Error(`Conexión directa fallida: ${directError.message}`);
      }

      setResult({
        directData
      });

      toast.success("Conexión directa a Supabase exitosa!");
      return true;
    } catch (err: any) {
      console.error('Error de conexión directa:', err);
      setError(err.message || "Error de conexión desconocido");
      toast.error(`Error de conexión directa: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testFunctionConnection = async () => {
    setIsTestingFunction(true);
    try {
      // Test edge function
      const { data: functionData, error: functionError } = await supabase.functions.invoke('test_connection');

      if (functionError) {
        throw new Error(`Conexión a Edge Function fallida: ${functionError.message}`);
      }

      setResult(prev => ({
        ...prev,
        functionData
      }));

      toast.success("Conexión a Edge Function exitosa!");
      return true;
    } catch (err: any) {
      console.error('Error de conexión a Edge Function:', err);
      setError(`Error en Edge Function: ${err.message || "Error desconocido"}`);
      toast.error(`Error de conexión a Edge Function: ${err.message}`);
      return false;
    } finally {
      setIsTestingFunction(false);
    }
  };

  const testConnection = async () => {
    const directSuccess = await testDirectConnection();
    if (directSuccess) {
      await testFunctionConnection();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Prueba de Conexión Supabase
        </CardTitle>
        <CardDescription>
          Verifica la conexión a tu proyecto de Supabase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">ID del Proyecto:</span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {import.meta.env.VITE_SUPABASE_URL?.split('.')?.[0]?.split('//')?.[1] || "ebbarmqwvxkxqbzmkiby"}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-medium">URL del proyecto:</span>
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                {import.meta.env.VITE_SUPABASE_URL || "https://ebbarmqwvxkxqbzmkiby.supabase.co"}
              </code>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-2">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-500" />
                <span>Comprobando conexión directa...</span>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : result?.directData ? (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-green-800 dark:text-green-200 text-sm">
                <p className="font-medium">Conexión directa exitosa!</p>
                <p className="mt-1">Último número de secuencia: {result.directData[0]?.last_number || '0'}</p>
              </div>
            </div>
          ) : null}

          {isTestingFunction ? (
            <div className="space-y-3 py-2">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin text-blue-500" />
                <span>Comprobando conexión a Edge Function...</span>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ) : result?.functionData ? (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-green-800 dark:text-green-200 text-sm">
                <p className="font-medium">Conexión a Edge Function exitosa!</p>
                <p className="mt-1">Respuesta: {JSON.stringify(result.functionData, null, 2)}</p>
              </div>
            </div>
          ) : null}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mt-1">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {(!result && !isLoading && !error) && (
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <Database className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Haz clic en "Probar Conexión" para verificar la conectividad con Supabase</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={testConnection} disabled={isLoading || isTestingFunction} className="gap-2">
          {(isLoading || isTestingFunction) && <RefreshCw className="h-4 w-4 animate-spin" />}
          {(isLoading || isTestingFunction) ? "Probando conexión..." : "Probar Conexión"}
        </Button>
        
        <a 
          href="https://app.supabase.com/project/ebbarmqwvxkxqbzmkiby" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          <span className="mr-1">Abrir panel de Supabase</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
};
