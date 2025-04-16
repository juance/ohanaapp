
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { ErrorMessage } from '@/components/ui/error-message';
import { Loading } from '@/components/ui/loading';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import { toast } from '@/lib/toast';
import { logError } from '@/lib/errorService';
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from '@/lib/types';

const Feedback = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [newClientFeedbackCount, setNewClientFeedbackCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState<string>(localStorage.getItem('lastFeedbackCheckTime') || new Date().toISOString());

  useEffect(() => {
    setIsComponentMounted(true);

    // Initial load
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Add any data loading logic here if needed
        setIsLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Error loading feedback data:", error);
        setError(error);
        logError(error, { context: 'Feedback Page', operation: 'initial load' });
        setIsLoading(false);
      }
    };

    loadData();

    return () => setIsComponentMounted(false);
  }, []);

  // Efecto para verificar nuevos comentarios del portal de clientes
  useEffect(() => {
    // Verificar si hay nuevos comentarios del portal de clientes
    const checkForNewClientFeedback = async () => {
      try {
        let newComments = [];
        let hasSourceColumn = true;

        // Primero intentamos con el filtro de source
        try {
          const { data, error } = await supabase
            .from('customer_feedback')
            .select('*')
            .eq('source', 'client_portal')
            .gt('created_at', lastCheckTime);

          if (error) {
            // Si el error es porque la columna no existe
            if (error.code === '42703' && error.message.includes('column customer_feedback.source does not exist')) {
              hasSourceColumn = false;
              console.log('La columna source no existe todavía. Obteniendo todos los comentarios recientes.');
            } else {
              throw error;
            }
          } else if (data) {
            newComments = data;
          }
        } catch (err) {
          if (err.code === '42703' && err.message.includes('column customer_feedback.source does not exist')) {
            hasSourceColumn = false;
            console.log('La columna source no existe todavía. Obteniendo todos los comentarios recientes.');
          } else {
            throw err;
          }
        }

        // Si no hay columna source, obtenemos todos los comentarios recientes
        if (!hasSourceColumn) {
          const { data, error } = await supabase
            .from('customer_feedback')
            .select('*')
            .gt('created_at', lastCheckTime);

          if (error) throw error;
          if (data) newComments = data;
        }

        // Procesar los comentarios encontrados
        if (newComments.length > 0) {
          setNewClientFeedbackCount(newComments.length);

          // Notificar al usuario sobre los nuevos comentarios
          toast({
            title: `${newComments.length} ${newComments.length === 1 ? 'nuevo comentario' : 'nuevos comentarios'}`,
            description: 'Se han recibido nuevos comentarios de clientes',
          });

          // Actualizar el contador de comentarios
          setRefreshTrigger(prev => prev + 1);
        }

        // Actualizar la última vez que se verificaron los comentarios
        const now = new Date().toISOString();
        setLastCheckTime(now);
        localStorage.setItem('lastFeedbackCheckTime', now);
      } catch (err) {
        console.error('Error al verificar nuevos comentarios:', err);
      }
    };

    // Verificar al cargar la página
    checkForNewClientFeedback();

    // Configurar un intervalo para verificar periódicamente
    const intervalId = setInterval(checkForNewClientFeedback, 60000); // Verificar cada minuto

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCheckTime]);

  const handleFeedbackAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Success",
      description: "Comentario agregado correctamente"
    });
  };

  if (!isComponentMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />

      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comentarios</h1>
              {newClientFeedbackCount > 0 && (
                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <Bell className="h-3 w-3 mr-1" />
                  {newClientFeedbackCount} {newClientFeedbackCount === 1 ? 'nuevo' : 'nuevos'}
                </div>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">
              Gestiona los comentarios de clientes
            </p>
          </div>

          <div className="mb-6">
            <Link to="/administration" className="text-blue-600 hover:underline flex items-center">
              Ver programa de fidelidad completo en Administración/Clientes
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {error ? (
            <ErrorMessage
              title="Error al cargar comentarios"
              message={error.message}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
              {isLoading ? (
                <div className="flex justify-center p-6"><Loading /></div>
              ) : (
                <FeedbackList refreshTrigger={refreshTrigger} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
