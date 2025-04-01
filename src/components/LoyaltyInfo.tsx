
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gift, Info } from 'lucide-react';

interface LoyaltyInfoProps {
  valetsCount: number;
  freeValets: number;
}

const LoyaltyInfo: React.FC<LoyaltyInfoProps> = ({ valetsCount, freeValets }) => {
  // Calculate progress towards next free valet (9 valets needed for 1 free)
  const currentProgress = valetsCount % 9;
  const progressPercentage = (currentProgress / 9) * 100;
  
  // Calculate valets needed for the next free one
  const valetsNeeded = 9 - currentProgress;
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 bg-blue-50">
        <CardTitle className="text-lg flex items-center text-blue-700">
          <Gift className="h-5 w-5 mr-2" />
          Programa de Fidelidad
        </CardTitle>
        <CardDescription>Sistema de Valets Gratis</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Valets acumulados</span>
            <span className="font-bold text-blue-600">{valetsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Valets gratis disponibles</span>
            <span className="font-bold text-green-600">{freeValets}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm">Progreso hacia siguiente valet gratis</span>
            <span className="text-sm font-medium">{currentProgress}/9</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {valetsNeeded > 0 ? (
            <p className="text-xs text-gray-500">
              Necesitas {valetsNeeded} valet{valetsNeeded !== 1 ? 's' : ''} más para obtener un valet gratis.
            </p>
          ) : (
            <p className="text-xs text-green-600 font-medium">
              ¡Puedes reclamar un valet gratis en tu próxima visita!
            </p>
          )}
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg flex items-start">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">¿Cómo funciona?</p>
            <p>Por cada 9 valets que compres, recibes 1 valet completamente gratis que puedes utilizar en tu próxima visita.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyInfo;
