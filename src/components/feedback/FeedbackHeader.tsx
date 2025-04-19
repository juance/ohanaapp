
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeedbackHeaderProps {
  newClientFeedbackCount: number;
  onGoBack: () => void;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({
  newClientFeedbackCount,
  onGoBack,
}) => {
  return (
    <>
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 mb-4"
          onClick={onGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comentarios</h1>
          {newClientFeedbackCount > 0 && (
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Bell className="h-3 w-3 mr-1" />
              {newClientFeedbackCount} {newClientFeedbackCount === 1 ? 'nuevo' : 'nuevos'}
            </div>
          )}
        </div>
        <p className="mt-1 text-muted-foreground">
          Gestiona los comentarios de clientes
        </p>
      </div>

      <div className="mb-6">
        <Link to="/administration" className="text-blue-600 hover:underline flex items-center">
          Ver programa de fidelidad completo en Administración/Clientes
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </>
  );
};

export default FeedbackHeader;
