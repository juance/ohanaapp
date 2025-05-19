
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addFeedback } from '@/lib/feedbackService';
import { Star } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserFeedbackFormProps {
  customerName: string;
  onFeedbackAdded?: () => void;
}

const UserFeedbackForm: React.FC<UserFeedbackFormProps> = ({
  customerName,
  onFeedbackAdded
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={`h-6 w-6 cursor-pointer ${
              starValue <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleStarClick(starValue)}
          />
        );
      });
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor ingrese un comentario'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass only the required fields for feedback
      const result = await addFeedback({
        customer_name: customerName,
        rating,
        comment,
        source: 'client_portal' // Indicar que el comentario viene del portal de clientes
      });

      if (result) {
        toast({
          title: "Éxito",
          description: 'Comentario enviado correctamente'
        });
        setComment('');
        setRating(5);
        if (onFeedbackAdded) {
          onFeedbackAdded();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: 'Error al enviar comentario'
        });
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Error al enviar comentario'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className={isMobile ? "px-4 py-3" : ""}>
        <CardTitle className="text-lg">Enviar Comentario</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 py-2" : ""}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Calificación</label>
            <div className="flex space-x-1">{renderStars()}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Comentario</label>
            <Textarea
              placeholder="Escribe tu comentario o sugerencia aquí"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={isMobile ? 3 : 4}
              className="text-sm md:text-base"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className={isMobile ? "px-4 py-3" : ""}>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full text-sm md:text-base"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserFeedbackForm;
