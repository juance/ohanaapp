
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { resetAllData } from '@/lib/resetService';
import { toast } from 'sonner';

const Reset = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const success = await resetAllData();
      if (success) {
        toast.success('Todos los datos han sido reiniciados correctamente');
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Error al reiniciar los datos:', error);
      toast.error('Error al reiniciar los datos');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-red-600">Reiniciar Datos</CardTitle>
              <CardDescription>
                Reinicia todos los datos de la aplicación
              </CardDescription>
            </div>
            <Link to="/" className="text-blue-600 hover:underline flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Volver
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {showConfirmation ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>¡Advertencia!</AlertTitle>
                <AlertDescription>
                  Esta acción eliminará permanentemente todos los datos de inventario, 
                  clientes y tickets. No se pueden recuperar una vez eliminados.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isResetting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Reiniciando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Confirmar Reinicio
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Esta acción reiniciará todos los datos del sistema, incluyendo:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Todos los productos de inventario</li>
                <li>Todos los clientes registrados</li>
                <li>Todos los tickets (pendientes y entregados)</li>
                <li>Todos los gastos registrados</li>
              </ul>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowConfirmation(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reiniciar Todos los Datos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reset;
