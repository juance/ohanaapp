
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExpensesHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleGoToHome}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al Inicio
      </Button>
      <h1 className="text-2xl font-bold">Gastos</h1>
      <div className="w-24"></div> {/* Spacer for centered title */}
    </div>
  );
};
