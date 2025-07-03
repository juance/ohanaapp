
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard } from 'lucide-react';
import MercadoPagoButton from './MercadoPagoButton';
import { toast } from '@/lib/toast';

const PaymentTestPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [description, setDescription] = useState<string>('Prueba de pago MercadoPago');
  const [ticketId, setTicketId] = useState<string>('test-ticket-001');
  const [lastPaymentResult, setLastPaymentResult] = useState<any>(null);

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    setLastPaymentResult(paymentData);
    toast.success('¡Pago procesado exitosamente!');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setLastPaymentResult({ error });
    toast.error(`Error en el pago: ${error}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Prueba de MercadoPago
          </CardTitle>
          <CardDescription>
            Prueba la integración con MercadoPago usando las credenciales de test actualizadas.
            <br />
            <strong>Usuario:</strong> TESTUSER136940674
            <br />
            <strong>Access Token:</strong> TEST-1276318702369620-061405... (versión actualizada)
            <br />
            <strong>Public Key:</strong> TEST-c604b4fb-41bd-4601-9859-6fbb770fa04c
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Monto ($)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                step="1"
              />
            </div>
            
            <div>
              <Label htmlFor="ticketId">ID del Ticket</Label>
              <Input
                id="ticketId"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="test-ticket-001"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del pago..."
            />
          </div>

          <div className="pt-4">
            <MercadoPagoButton
              amount={amount}
              description={description}
              ticketId={ticketId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </CardContent>
      </Card>

      {lastPaymentResult && (
        <Card>
          <CardHeader>
            <CardTitle>Último Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(lastPaymentResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Información de Testing Actualizada</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p className="mb-2">
            <strong>Credenciales de prueba actualizadas:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Usuario de prueba: TESTUSER136940674</li>
            <li>Access Token: TEST-1276318702369620-061405... (actualizado)</li>
            <li>Public Key: TEST-c604b4fb-41bd-4601-9859-6fbb770fa04c</li>
            <li>Ambiente: Sandbox de MercadoPago</li>
          </ul>
          <p className="mt-4 text-sm">
            Los pagos realizados en este modo son simulados y no se cobran realmente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTestPage;
