
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { ErrorMessage } from '@/components/ui/error-message';
import { Loading } from '@/components/ui/loading';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';
import { logError } from '@/lib/errorService';

const Feedback = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comentarios</h1>
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
