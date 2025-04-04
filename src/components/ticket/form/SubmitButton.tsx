
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting = false }) => {
  return (
    <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
      {isSubmitting ? 'Procesando...' : 'Generar Ticket'}
    </Button>
  );
};
