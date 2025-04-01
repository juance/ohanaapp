
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { ClientVisit } from '@/lib/types';

interface LoyaltyProgramProps {
  selectedClient: ClientVisit | null;
  pointsToAdd: number;
  pointsToRedeem: number;
  isAddingPoints: boolean;
  onPointsToAddChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPointsToRedeemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPoints: () => void;
  onRedeemPoints: () => void;
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({
  selectedClient,
  pointsToAdd,
  pointsToRedeem,
  isAddingPoints,
  onPointsToAddChange,
  onPointsToRedeemChange,
  onAddPoints,
  onRedeemPoints
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2 text-blue-600" />
          Programa de Lealtad
        </CardTitle>
        <CardDescription>Administrar puntos de lealtad de los clientes</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedClient ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
              <h3 className="font-medium mb-2">Cliente: {selectedClient.clientName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm border">
                  <div className="text-sm text-gray-500">Puntos de lealtad</div>
                  <div className="text-xl font-bold text-blue-700">{selectedClient.loyaltyPoints || 0}</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm border">
                  <div className="text-sm text-gray-500">Valets acumulados</div>
                  <div className="text-xl font-bold text-blue-700">{selectedClient.valetsCount || 0}</div>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm border">
                  <div className="text-sm text-gray-500">Valets gratis</div>
                  <div className="text-xl font-bold text-blue-700">{selectedClient.freeValets || 0}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Agregar puntos</h4>
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    min="1"
                    value={pointsToAdd || ''}
                    onChange={onPointsToAddChange}
                    placeholder="Puntos a agregar"
                  />
                  <Button 
                    onClick={onAddPoints} 
                    disabled={isAddingPoints || pointsToAdd <= 0}
                  >
                    {isAddingPoints ? <Loading className="h-4 w-4" /> : "Agregar"}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Canjear puntos</h4>
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    min="1"
                    max={selectedClient.loyaltyPoints || 0}
                    value={pointsToRedeem || ''}
                    onChange={onPointsToRedeemChange}
                    placeholder="Puntos a canjear"
                  />
                  <Button 
                    onClick={onRedeemPoints} 
                    disabled={!selectedClient.loyaltyPoints || pointsToRedeem <= 0 || pointsToRedeem > (selectedClient.loyaltyPoints || 0)}
                  >
                    Canjear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Seleccione un cliente para administrar sus puntos de lealtad y valets gratuitos.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgram;
