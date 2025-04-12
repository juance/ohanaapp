
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { WhatsApp, Loader2 } from 'lucide-react';
import { requestPasswordReset } from '@/lib/auth';

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
      // Call the function to request password reset
      await requestPasswordReset(phoneNumber);
      
      // Show success message
      setStep('success');
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el mensaje de recuperación. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state for next time
    setTimeout(() => {
      setStep('request');
      setPhoneNumber('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  type="tel"
                  placeholder="Número de teléfono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancelar
                </Button>
                
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <WhatsApp className="h-4 w-4" />
                      Enviar mensaje
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>¡Listo!</DialogTitle>
              <DialogDescription>
                Hemos enviado un mensaje de WhatsApp al número {phoneNumber} con tu contraseña temporal.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 px-4 text-center">
              <div className="flex items-center justify-center rounded-full bg-green-100 p-3 mx-auto w-16 h-16 mb-4">
                <WhatsApp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Cuando inicies sesión con la contraseña temporal, se te pedirá que la cambies por una nueva.
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" onClick={handleClose} className="w-full">
                Entendido
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
