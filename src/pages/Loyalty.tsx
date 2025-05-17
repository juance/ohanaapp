
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import LoyaltyInfo from '@/components/LoyaltyInfo';
import { ResetClientCounters } from '@/components/admin/ResetClientCounters';

const Loyalty: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<{name: string, valetsCount: number, freeValets: number} | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const handleSearch = () => {
    if (phoneNumber.trim() === '') return;
    
    setSelectedCustomer({
      name: 'Cliente de Ejemplo',
      valetsCount: 7,
      freeValets: 1
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Programa de Fidelidad</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-8" 
                placeholder="Ingrese número de teléfono..." 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>
        </CardContent>
      </Card>

      {selectedCustomer && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{selectedCustomer.name}</h2>
          
          <LoyaltyInfo 
            valetsCount={selectedCustomer.valetsCount} 
            freeValets={selectedCustomer.freeValets} 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Historial de Valets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Aquí se mostrará el historial de valets del cliente
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {!selectedCustomer && (
        <div className="text-center py-12 text-muted-foreground">
          Busque un cliente para ver su información de fidelidad
        </div>
      )}

      <div className="mt-12 pt-6 border-t border-muted">
        <ResetClientCounters />
      </div>
    </div>
  );
};

export default Loyalty;
