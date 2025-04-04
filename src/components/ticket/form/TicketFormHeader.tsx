
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export const TicketFormHeader: React.FC = () => {
  return (
    <>
      <CardTitle className="text-xl">Formulario de Ticket</CardTitle>
      <CardDescription>Genere tickets para valets o tintorería</CardDescription>
    </>
  );
};
