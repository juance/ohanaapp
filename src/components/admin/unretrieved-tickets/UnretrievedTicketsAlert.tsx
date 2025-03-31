
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { TicketAlertSection } from './TicketAlertSection';
import { MessageDialog } from './MessageDialog';
import { useUnretrievedTickets } from './useUnretrievedTickets';

export function UnretrievedTicketsAlert() {
  const {
    tickets45Days,
    tickets90Days,
    isLoading,
    messageDialogOpen,
    setMessageDialogOpen,
    selectedTicket,
    messageType,
    customMessage,
    setCustomMessage,
    loadUnretrievedTickets,
    handleOpenMessageDialog,
    sendWhatsAppMessage
  } = useUnretrievedTickets();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Alertas de Tickets No Retirados</span>
          </CardTitle>
          <CardDescription>
            Tickets que no han sido retirados por los clientes después de 45 y 90 días
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center p-4">
              <p>Cargando tickets...</p>
            </div>
          ) : (
            <>
              {/* Alerta de 45 días */}
              <TicketAlertSection
                tickets={tickets45Days}
                days={45}
                onOpenMessageDialog={handleOpenMessageDialog}
              />
              
              {/* Alerta de 90 días */}
              <TicketAlertSection
                tickets={tickets90Days}
                days={90}
                onOpenMessageDialog={handleOpenMessageDialog}
              />
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={loadUnretrievedTickets} 
                  className="flex items-center gap-1"
                >
                  Actualizar datos
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for WhatsApp message */}
      <MessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        selectedTicket={selectedTicket}
        messageType={messageType}
        customMessage={customMessage}
        onMessageChange={setCustomMessage}
        onSendWhatsApp={sendWhatsAppMessage}
      />
    </div>
  );
}
