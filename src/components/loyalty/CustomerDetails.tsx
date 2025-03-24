
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CustomerDetailsProps {
  name: string;
  phone: string;
  valetsCount: number;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  name,
  phone,
  valetsCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
        <CardDescription>Datos del cliente y estado actual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>Nombre</Label>
          <p className="text-lg font-medium">{name}</p>
        </div>
        <div className="space-y-1">
          <Label>Teléfono</Label>
          <p className="text-lg font-medium">{phone}</p>
        </div>
        <div className="space-y-1">
          <Label>Valets Realizados</Label>
          <p className="text-lg font-medium">{valetsCount}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;
