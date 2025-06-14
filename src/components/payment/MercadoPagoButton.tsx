
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface MercadoPagoButtonProps {
  amount: number;
  description?: string;
  ticketId?: string;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: string) => void;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({
  amount,
  description = 'Pago Lavandería Ohana',
  ticketId,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      console.log('Iniciating MercadoPago payment:', { amount, description, ticketId });
      
      const { data, error } = await supabase.functions.invoke('mercadopago-payment', {
        body: {
          amount: amount,
          description: description,
          ticketId: ticketId
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      console.log('Payment response:', data);
      
      // Handle different payment statuses
      switch (data.status) {
        case 'approved':
          toast.success('¡Pago aprobado exitosamente!');
          onSuccess?.(data);
          break;
        case 'pending':
          toast.success('Pago pendiente de aprobación');
          onSuccess?.(data);
          break;
        case 'in_process':
          toast.success('Pago en proceso');
          onSuccess?.(data);
          break;
        case 'rejected':
          toast.error('Pago rechazado');
          onError?.('Pago rechazado por MercadoPago');
          break;
        default:
          toast.success(`Pago creado con estado: ${data.status}`);
          onSuccess?.(data);
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error en el pago: ${errorMessage}`);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading || amount <= 0}
      className="bg-blue-500 hover:bg-blue-600 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar con MercadoPago (${amount})
        </>
      )}
    </Button>
  );
};

export default MercadoPagoButton;
