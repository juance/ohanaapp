
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { resetLocalData } from '@/lib/data/syncService';

const Administration = () => {
  const { toast } = useToast();
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('loading');
  const [resetMessage, setResetMessage] = useState('Reiniciando todos los datos...');

  useEffect(() => {
    const resetAllData = async () => {
      try {
        setResetStatus('loading');
        
        // Call the Supabase edge function to reset all data
        const { data, error } = await supabase.functions.invoke('reset_all_data', {
          method: 'POST',
        });
        
        if (error) {
          console.error("Error calling reset_all_data function:", error);
          throw new Error(`Error resetting data: ${error.message}`);
        }
        
        if (!data.success) {
          console.error("Reset function returned error:", data.error);
          throw new Error(`Error from server: ${data.error}`);
        }
        
        // Reset local storage data
        const localResetSuccessful = resetLocalData();
        
        if (!localResetSuccessful) {
          console.warn("Local data reset may have been incomplete");
        }
        
        toast({
          title: "Datos reiniciados",
          description: "Todos los datos han sido reiniciados exitosamente.",
        });
        
        setResetStatus('success');
        setResetMessage('Datos reiniciados exitosamente');
        
      } catch (err) {
        console.error("Error resetting data:", err);
        setResetStatus('error');
        setResetMessage(`Error: ${err.message}`);
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un problema al reiniciar los datos. Intente nuevamente.",
        });
      }
    };

    resetAllData();
  }, [toast]);
  
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
              <Card className={`${
                resetStatus === 'success' 
                  ? 'border-green-200'
                  : resetStatus === 'error'
                    ? 'border-red-200' 
                    : 'border-yellow-200'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {resetStatus === 'loading' && (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent"></div>
                    )}
                    {resetStatus === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
                    {resetStatus === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
                    <h3 className={`font-medium ${
                      resetStatus === 'success' 
                        ? 'text-green-600'
                        : resetStatus === 'error'
                          ? 'text-red-600' 
                          : 'text-yellow-600'
                    }`}>
                      {resetMessage}
                    </h3>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-500">
                    {resetStatus === 'success' && "Todos los tickets, pedidos, gastos y puntos de fidelidad han sido reiniciados. Los clientes se mantienen en el sistema pero con sus puntos de fidelidad en cero."}
                    {resetStatus === 'loading' && "Eliminando tickets, pedidos, gastos y reiniciando puntos de fidelidad..."}
                    {resetStatus === 'error' && "Ocurrió un error al reiniciar los datos. Por favor, inténtelo nuevamente o contacte al soporte técnico."}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              {/* Additional admin tools can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
