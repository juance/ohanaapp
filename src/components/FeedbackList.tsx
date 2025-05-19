
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerFeedback } from '@/lib/types/feedback.types';
import { getAllFeedback, deleteFeedback } from '@/lib/feedbackService';
import { saveToLocalStorage } from '@/lib/data/coreUtils';
import { Star, Trash2, RefreshCw, User, MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/lib/toast';
import { ErrorMessage } from '@/components/ui/error-message';
import { Loading } from '@/components/ui/loading';
import { logError } from '@/lib/errorService';

const FeedbackList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useIsMobile();

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllFeedback();
      setFeedback(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error fetching feedback:", error);
      setError(error);
      logError(error, { context: 'FeedbackList', operation: 'load feedback' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const confirmed = window.confirm('¿Está seguro de eliminar este comentario?');
      if (confirmed) {
        const success = await deleteFeedback(id);

        if (success) {
          setFeedback(feedback.filter(item => item.id !== id));
          toast.success("Comentario eliminado exitosamente");
        } else {
          throw new Error("No se pudo eliminar el comentario");
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error deleting feedback:", error);
      logError(error, { context: 'FeedbackList', operation: 'delete feedback' });
      toast.error(error.message || "Error al eliminar el comentario");
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 md:h-4 md:w-4 ${
            index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar comentarios"
        message={error.message}
        onRetry={loadFeedback}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loading className="mx-auto" />
        <p className="mt-4 text-sm md:text-base text-gray-600">Cargando comentarios...</p>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm md:text-base">No hay comentarios para mostrar</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={loadFeedback}
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          Actualizar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
      {feedback.map((item) => (
        <Card key={item.id} className="shadow-sm">
          <CardHeader className={`pb-1 md:pb-2 ${isMobile ? 'px-3 py-2' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base md:text-lg">{item.customer_name}</CardTitle>
                  {item.source === 'client_portal' && (
                    <div className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Portal Cliente
                    </div>
                  )}
                </div>
                <div className="flex mt-1">{renderStars(item.rating)}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 md:h-8 md:w-8"
              >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className={isMobile ? 'px-3 py-2' : ''}>
            <p className="text-xs md:text-sm text-gray-700">{item.comment}</p>
            <p className="text-xs text-gray-500 mt-1 md:mt-2">Fecha: {item.created_at}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
