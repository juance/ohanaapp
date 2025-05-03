
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ClientVisit } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoyaltyProgramProps {
  client: ClientVisit;
  onRedeemValet?: () => void;
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({ client, onRedeemValet }) => {
  // Calculate progress based on visitCount
  const valetCount = client.visitCount || 0;
  const progress = valetCount % 9; // 9 visits for a free valet
  const progressPercentage = (progress / 9) * 100;
  
  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Programa de Fidelidad</CardTitle>
          <Badge variant="outline" className="px-2 py-1">
            {client.freeValets} valet{client.freeValets !== 1 ? 's' : ''} gratis
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Progreso hacia próximo valet gratis</h4>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs mt-1">
            <span>{progress} de 9 visitas</span>
            <span>{9 - progress} más para valet gratis</span>
          </div>
        </div>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">Total de visitas</div>
            <div className="text-xl font-bold">{valetCount}</div>
          </div>
          
          {onRedeemValet && client.freeValets > 0 && (
            <Button 
              variant="default"
              size="sm"
              onClick={onRedeemValet}
            >
              Usar valet gratis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgram;
