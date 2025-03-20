
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { addFeedback } from '@/lib/feedbackService';
import { getCustomerByPhone } from '@/lib/customerService';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

const FeedbackForm = ({ onFeedbackAdded }: { onFeedbackAdded: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCustomerSearch = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Por favor ingrese un número de teléfono');
      return;
    }

    try {
      const customer = await getCustomerByPhone(phoneNumber);
      if (customer) {
        setCustomerId(customer.id);
        toast.success(`Cliente encontrado: ${customer.name}`);
      } else {
        toast.error('Cliente no encontrado');
        setCustomerId(null);
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      toast.error('Error al buscar cliente');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId) {
      toast.error('Por favor busque un cliente primero');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Por favor ingrese un comentario');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await addFeedback({
        customerId,
        comment,
        rating
      });
      
      if (result) {
        setPhoneNumber('');
        setComment('');
        setRating(5);
        setCustomerId(null);
        onFeedbackAdded();
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Agregar Comentario de Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Teléfono del cliente"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={handleCustomerSearch}
              >
                Buscar
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Calificación</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`cursor-pointer h-6 w-6 ${
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
              rows={4}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !customerId}
          className="w-full"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackForm;
