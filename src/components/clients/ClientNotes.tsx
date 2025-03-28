
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ClientVisit } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface ClientNotesProps {
  client: ClientVisit | null;
  clientNotes: string;
  onSaveNotes: (notes: string) => Promise<void>;
}

const ClientNotes: React.FC<ClientNotesProps> = ({ client, clientNotes, onSaveNotes }) => {
  const [notes, setNotes] = useState(clientNotes);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  if (!client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notas del Cliente</CardTitle>
          <CardDescription>Seleccione un cliente para ver o agregar notas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-center text-muted-foreground">
            No hay cliente seleccionado
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSaveNotes = async () => {
    if (!client) return;
    
    setIsSaving(true);
    try {
      await onSaveNotes(notes);
      toast({
        title: "Notas guardadas",
        description: "Las notas del cliente han sido guardadas con éxito.",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar las notas. Inténtelo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas del Cliente</CardTitle>
        <CardDescription>Agregar notas importantes sobre {client.clientName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Escriba notas sobre el cliente aquí..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-32"
          />
          <Button onClick={handleSaveNotes} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Notas'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientNotes;
