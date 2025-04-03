import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerFeedback } from '@/lib/types';
import { getFeedback, deleteFeedback } from '@/lib/feedbackService';
import { Star, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

const FeedbackList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadFeedback = async () => {
      setIsLoading(true);
      const data = await getFeedback();
      setFeedback(data);
      setIsLoading(false);
    };

    loadFeedback();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('¿Está seguro de eliminar este comentario?');
    if (confirmed) {
      const success = await deleteFeedback(id);
      if (success) {
        setFeedback(feedback.filter(item => item.id !== id));
        toast("Comentario eliminado exitosamente");
      } else {
        toast.error("Error al eliminar el comentario");
      }
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

  if (isLoading) {
    return <div className="text-center py-4 text-sm md:text-base">Cargando comentarios...</div>;
  }

  if (feedback.length === 0) {
    return <div className="text-center py-4 text-sm md:text-base">No hay comentarios para mostrar</div>;
  }

  return (
    <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
      {feedback.map((item) => (
        <Card key={item.id} className="shadow-sm">
          <CardHeader className={`pb-1 md:pb-2 ${isMobile ? 'px-3 py-2' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base md:text-lg">{item.customerName}</CardTitle>
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
            <p className="text-xs text-gray-500 mt-1 md:mt-2">Fecha: {item.createdAt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
