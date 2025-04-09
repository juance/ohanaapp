
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { addFeedback } from '@/lib/feedbackService';
import { getCustomerByPhone } from '@/lib/dataService';
import { Star } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useIsMobile } from '@/hooks/use-mobile';

const FeedbackForm = ({ onFeedbackAdded }: { onFeedbackAdded: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleCustomerSearch = async () => {
    if (!phoneNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor ingrese un número de teléfono'
      });
      return;
    }

    try {
      const customer = await getCustomerByPhone(phoneNumber);
      if (customer) {
        setCustomerId(customer.id);
        setCustomerName(customer.name);
        toast({
          title: "Success",
          description: `Cliente encontrado: ${customer.name}`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: 'Cliente no encontrado'
        });
        setCustomerId(null);
        setCustomerName('');
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Error al buscar cliente'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor busque un cliente primero'
      });
      return;
    }

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
      const result = await addFeedback({
        customerName,
        rating,
        comment
      });

      if (result) {
        toast({
          title: "Success",
          description: 'Comentario agregado correctamente'
        });
        setPhoneNumber('');
        setComment('');
        setRating(5);
        setCustomerId(null);
        setCustomerName('');
        onFeedbackAdded();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: 'Error al agregar comentario'
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
    <Card className="w-full mb-4 md:mb-6">
      <CardHeader className={isMobile ? "px-3 py-2" : ""}>
        <CardTitle className={isMobile ? "text-lg" : ""}>Agregar Comentario</CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 pt-0" : ""}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 md:gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Teléfono del cliente"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 text-sm md:text-base"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCustomerSearch}
                className="text-xs md:text-sm px-2 md:px-3"
              >
                Buscar
              </Button>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Calificación</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`cursor-pointer ${isMobile ? 'h-5 w-5' : 'h-6 w-6'} ${
                      rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Comentario del cliente"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={isMobile ? 3 : 4}
              className="text-sm md:text-base"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className={isMobile ? "px-3 pb-3" : ""}>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !customerId}
          className="w-full text-sm md:text-base"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackForm;
