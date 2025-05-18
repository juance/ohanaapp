
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { MessageSquare, ThumbsUp, ThumbsDown, Star, StarHalf } from 'lucide-react';
import { getAllFeedback, addFeedback, deleteFeedback } from '@/lib/feedback/feedbackService';
import { CustomerFeedback } from '@/lib/types/feedback.types';
import { format } from 'date-fns';

const Feedback = () => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await getAllFeedback();
      setFeedback(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar comentarios');
      console.error('Error loading feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback(id);
      setFeedback(feedback.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Error al eliminar comentario');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    return stars;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Comentarios de Clientes</h1>
          <Button onClick={loadFeedback} variant="outline">
            Actualizar
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center p-8 border rounded-md bg-gray-50">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2">No hay comentarios disponibles</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {feedback.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.customerName}</CardTitle>
                      <CardDescription>
                        {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.comment}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span className="capitalize bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                      {item.source || 'app'}
                    </span>
                    {item.pendingSync && (
                      <span className="ml-2 bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                        Pendiente de sincronización
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Feedback;
