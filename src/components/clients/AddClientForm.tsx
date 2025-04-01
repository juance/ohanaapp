
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

interface AddClientFormProps {
  newClientName: string;
  newClientPhone: string;
  isAddingClient: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClient: () => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({
  newClientName,
  newClientPhone,
  isAddingClient,
  onNameChange,
  onPhoneChange,
  onAddClient
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Cliente</CardTitle>
        <CardDescription>Agregar un nuevo cliente a la base de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              type="text"
              id="name"
              value={newClientName}
              onChange={onNameChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Teléfono
            </Label>
            <Input
              type="tel"
              id="phone"
              value={newClientPhone}
              onChange={onPhoneChange}
              className="col-span-3"
            />
          </div>
          <Button onClick={onAddClient} disabled={isAddingClient}>
            {isAddingClient ? (
              <>
                <Loading className="mr-2" />
                Agregando...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddClientForm;
