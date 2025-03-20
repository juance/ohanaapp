
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerFeedback } from '@/lib/types';
import { getAllFeedback, deleteFeedback } from '@/lib/feedbackService';
import { Star, Trash2 } from 'lucide-react';

const FeedbackList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      setIsLoading(true);
      const data = await getAllFeedback();
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
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando comentarios...</div>;
  }

  if (feedback.length === 0) {
    return <div className="text-center py-4">No hay comentarios para mostrar</div>;
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.customerName}</CardTitle>
                <div className="flex mt-1">{renderStars(item.rating)}</div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{item.comment}</p>
            <p className="text-xs text-gray-500 mt-2">Fecha: {item.createdAt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
