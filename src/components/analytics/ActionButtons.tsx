
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface ActionButtonsProps {
  onExportData: () => Promise<void>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onExportData }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExportData();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={handleExport}
        disabled={isExporting}
      >
        <Download className="h-4 w-4" />
        {isExporting ? 'Exportando...' : 'Exportar CSV'}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2 print:hidden"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
        Imprimir
      </Button>
    </div>
  );
};

export default ActionButtons;
