
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FormHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="text-xl">Formulario de Ticket</CardTitle>
      <CardDescription>Genere tickets para valets o tintorería</CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
