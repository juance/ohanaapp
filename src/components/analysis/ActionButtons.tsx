
import { Download, RefreshCw, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ActionButtonsProps {
  onExportData: () => void;
}

const ActionButtons = ({ onExportData }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button variant="outline" onClick={() => window.location.reload()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Actualizar
      </Button>
      
      <Button variant="outline" onClick={onExportData}>
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
      
      <Link to="/clients">
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Gestionar Clientes
        </Button>
      </Link>
      
      <Button variant="default" asChild>
        <Link to="/loyalty">
          <Star className="mr-2 h-4 w-4" />
          Programa de Fidelidad
        </Link>
      </Button>
    </div>
  );
};

export default ActionButtons;
