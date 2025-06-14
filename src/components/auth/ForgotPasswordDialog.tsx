
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Loader2 } from 'lucide-react';
import { requestPasswordReset } from '@/lib/supabaseAuthService';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'success'>('request');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 8) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un número de teléfono válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await requestPasswordReset(phoneNumber);
      setStep('success');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setStep('request');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'request' ? (
          <>
            <DialogHeader>
              <DialogTitle>Recuperar contraseña</DialogTitle>
              <DialogDescription>
                Ingresa tu número de teléfono y te enviaremos un WhatsApp con una contraseña temporal.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  id="phoneNumber"
                  placeholder="Número de teléfono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar contraseña'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Contraseña temporal enviada</DialogTitle>
              <DialogDescription>
                Te hemos enviado un WhatsApp con tu contraseña temporal.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 flex justify-center">
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-start">
                <MessageSquare className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Instrucciones:</p>
                  <ol className="list-decimal ml-5 mt-1 text-sm space-y-1">
                    <li>Revisa tu WhatsApp en el número {phoneNumber}</li>
                    <li>Usa la contraseña temporal para iniciar sesión</li>
                    <li>Al iniciar sesión, se te pedirá crear una nueva contraseña</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleClose}
                className="w-full"
              >
                Entendido
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
