
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { resetLocalData } from '@/lib/data/syncService';

const Administration = () => {
  const { toast } = useToast();
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resetMessage, setResetMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  const resetAllData = async () => {
    if (isResetting) return;
    
    try {
      setIsResetting(true);
      setResetStatus('loading');
      
      // Call the Supabase edge function to reset all data
      const { data, error } = await supabase.functions.invoke('reset_all_data', {
        method: 'POST'
      });
      
      // Always check the "success" field in the response rather than the error
      if (data && data.success) {
        // Reset local storage data
        resetLocalData();
        
        setResetStatus('success');
        setResetMessage(data.message || "Todos los datos han sido reiniciados exitosamente.");
        
        toast({
          title: "Datos reiniciados",
          description: "Todos los datos han sido reiniciados exitosamente.",
        });
      } else {
        throw new Error(data?.error || error?.message || "Error desconocido al reiniciar los datos");
      }
    } catch (err) {
      console.error("Error resetting data:", err);
      setResetStatus('error');
      setResetMessage(err.message || "Hubo un problema al reiniciar los datos.");
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al reiniciar los datos. Intente nuevamente.",
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  useEffect(() => {
    // Reset data automatically on page load
    resetAllData();
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
              <div className="flex items-center">
                <p className="text-gray-500">Administración</p>
                <Badge variant="destructive" className="ml-2">Área Restringida</Badge>
              </div>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Estado del Sistema</h2>
            </div>
            
            <div className="md:col-span-2">
              <Card className={`border-${resetStatus === 'error' ? 'red' : resetStatus === 'success' ? 'green' : 'blue'}-200`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-${resetStatus === 'error' ? 'red' : resetStatus === 'success' ? 'green' : 'blue'}-600 flex items-center gap-2`}>
                    {resetStatus === 'loading' && <RefreshCw className="h-5 w-5 animate-spin" />}
                    {resetStatus === 'error' && <AlertTriangle className="h-5 w-5" />}
                    {resetStatus === 'success' && <CheckCircle className="h-5 w-5" />}
                    {resetStatus === 'idle' && <RefreshCw className="h-5 w-5" />}
                    
                    {resetStatus === 'loading' && "Reiniciando todos los datos..."}
                    {resetStatus === 'error' && "Error al reiniciar los datos"}
                    {resetStatus === 'success' && "Datos reiniciados con éxito"}
                    {resetStatus === 'idle' && "Preparando reinicio de datos"}
                  </CardTitle>
                  <CardDescription>
                    {resetStatus === 'error' ? 
                      "Ocurrió un error al reiniciar los datos. Por favor, inténtelo nuevamente o contacte al soporte técnico." :
                      "Esta operación elimina todos los tickets, pedidos, gastos y reinicia los puntos de fidelidad."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {resetMessage && (
                    <p className={`text-sm ${resetStatus === 'error' ? 'text-red-600' : resetStatus === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
                      {resetMessage}
                    </p>
                  )}
                  
                  {resetStatus === 'success' && (
                    <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-200">
                      <h3 className="text-sm font-medium text-green-800">Datos reiniciados correctamente:</h3>
                      <ul className="mt-2 list-disc pl-5 text-sm text-green-700 space-y-1">
                        <li>Tickets y órdenes eliminados</li>
                        <li>Puntos de fidelidad reiniciados</li>
                        <li>Gastos eliminados</li>
                        <li>Secuencia de tickets reiniciada</li>
                      </ul>
                    </div>
                  )}
                  
                  {resetStatus === 'error' && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600 font-medium">Error: {resetMessage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
