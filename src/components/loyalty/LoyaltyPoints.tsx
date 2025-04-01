
import React from 'react';
import { Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface LoyaltyPointsProps {
  loyaltyPoints: number;
  freeValets: number;
  handleRedeemValet: () => void;
  redeeming: boolean;
}

const LoyaltyPoints: React.FC<LoyaltyPointsProps> = ({
  loyaltyPoints,
  freeValets,
  handleRedeemValet,
  redeeming
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Puntos de Fidelidad
        </CardTitle>
        <CardDescription>
          Por cada valet el cliente acumula 10 puntos. Con 100 puntos puede canjear un valet gratis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <h3 className="text-muted-foreground text-sm">Puntos</h3>
            <p className="text-3xl font-bold">{loyaltyPoints}</p>
          </div>
          <div className="flex-1">
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${Math.min(100, (loyaltyPoints % 100))}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1">
              {loyaltyPoints >= 100 
                ? '¡Puede canjear un valet gratis!' 
                : `${100 - (loyaltyPoints % 100)} puntos más para un valet gratis`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm">Valets Gratis Disponibles</h3>
            <p className="text-2xl font-bold">{freeValets}</p>
          </div>
          <Button
            variant="outline"
            disabled={loyaltyPoints < 100 || redeeming}
            onClick={handleRedeemValet}
            className="flex items-center"
          >
            <Gift className="mr-2 h-4 w-4" />
            {redeeming ? 'Procesando...' : 'Canjear Valet Gratis'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Los valets gratis se podrán utilizar en el formulario de tickets seleccionando la opción correspondiente.
      </CardFooter>
    </Card>
  );
};

export default LoyaltyPoints;
