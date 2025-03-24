
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CustomerSearchProps {
  phone: string;
  setPhone: (phone: string) => void;
  handleSearch: () => void;
  loading: boolean;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({
  phone,
  setPhone,
  handleSearch,
  loading
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center gap-4">
        <Award className="h-8 w-8 text-blue-500" />
        <div>
          <CardTitle>Búsqueda de Cliente</CardTitle>
          <CardDescription>Ingrese el número de teléfono del cliente para consultar su estado de fidelidad</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="phone">Número de Teléfono</Label>
            <Input
              id="phone"
              placeholder="Ej: 11 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSearch;
