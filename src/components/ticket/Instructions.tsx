
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Instructions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Instrucciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Uso del Formulario:</h3>
          <ul className="ml-5 mt-2 list-disc text-muted-foreground text-sm space-y-1">
            <li>Complete los datos del cliente.</li>
            <li>Puede buscar clientes existentes por teléfono.</li>
            <li>Seleccione la fecha del ticket.</li>
            <li>Seleccione el tipo de servicio (valet o tintorería).</li>
            <li>Para valet, especifique la cantidad y opciones.</li>
            <li>Para tintorería, seleccione los artículos.</li>
            <li>Seleccione el método de pago.</li>
            <li>El precio se calcula automáticamente.</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium">Recordatorios:</h3>
          <ul className="ml-5 mt-2 list-disc text-muted-foreground text-sm space-y-1">
            <li>El valet tiene un costo de $5.000 cada uno.</li>
            <li>Los precios de tintorería varían según el artículo.</li>
            <li>Verificar siempre la información antes de generar el ticket.</li>
            <li className="text-blue-700 font-semibold">Por cada 9 valets, el cliente recibe 1 valet gratis.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
