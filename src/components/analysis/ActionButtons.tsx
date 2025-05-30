
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface ActionButtonsProps {
  onExportData: () => Promise<void>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onExportData }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <Button onClick={onExportData} variant="outline" size="sm" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Exportar
      </Button>
      <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
        <Printer className="h-4 w-4" />
        Imprimir
      </Button>
    </div>
  );
};

export default ActionButtons;
