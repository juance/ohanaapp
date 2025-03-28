
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientVisit } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

interface ClientNotesProps {
  client: ClientVisit | null;
  clientNotes: string;
  isLoading?: boolean;
  onSaveNotes: (notes: string) => Promise<void>;
}

const ClientNotes: React.FC<ClientNotesProps> = ({ 
  client, 
  clientNotes, 
  isLoading = false,
  onSaveNotes 
}) => {
  const [notes, setNotes] = useState(clientNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(clientNotes);
  }, [clientNotes]);

  const handleSave = async () => {
    if (!client) return;
    
    setIsSaving(true);
    try {
      await onSaveNotes(notes);
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas del Cliente</CardTitle>
        <CardDescription>
          {client ? `Notas para ${client.clientName}` : 'Seleccione un cliente para ver sus notas'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loading />
          </div>
        ) : (
          <>
            <Textarea
              className="mb-4 min-h-32"
              placeholder={client ? "Escriba notas sobre este cliente..." : "Seleccione un cliente primero"}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!client || isSaving}
            />
            <Button
              onClick={handleSave}
              disabled={!client || isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loading className="mr-2 h-4 w-4" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Notas
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientNotes;
