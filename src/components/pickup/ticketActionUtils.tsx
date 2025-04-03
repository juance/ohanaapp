import { Ticket } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

// Utility function to notify a client that their order is ready
export const handleNotifyClient = (ticket: Ticket) => {
  if (!ticket || !ticket.phoneNumber) {
    toast.error("Error", "No hay número de teléfono disponible");
    return;
  }
  
  try {
    // For now, just show a toast - this could be expanded to send actual notifications
    toast.success("Cliente notificado", 
      `Se ha enviado una notificación a ${ticket.clientName}`);
  } catch (error) {
    console.error("Error notifying client:", error);
    toast.error("Error", "Error al notificar al cliente");
  }
};

// Generate WhatsApp share link
export const handleShareWhatsApp = (ticket?: Ticket, services?: any[]) => {
  if (!ticket) {
    toast.error("Error", "Seleccione un ticket primero");
    return;
  }

  try {
    const servicesList = services?.map(s => `${s.name} x${s.quantity}: $${s.price}`).join('\n') || '';
    
    const message = encodeURIComponent(
      `*Lavandería Ohana*\n\n` +
      `Hola ${ticket.clientName},\n\n` +
      `Tu pedido está listo para retirar.\n` +
      `*Ticket:* ${ticket.ticketNumber}\n` +
      `*Total:* $${ticket.totalPrice}\n\n` +
      `*Detalles:*\n${servicesList}`
    );
    
    const whatsappURL = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    toast.success("WhatsApp abierto", 
      "Se ha abierto WhatsApp con el mensaje pre-escrito");
  } catch (error) {
    console.error("Error sharing via WhatsApp:", error);
    toast.error("Error", "Error al abrir WhatsApp");
  }
};

// Generate content for printing ticket
export const generatePrintContent = (ticket: Ticket, services: any[]) => {
  const servicesList = services.map(s => 
    `<div style="display:flex; justify-content:space-between; margin-bottom:5px;">
      <div>${s.name} x${s.quantity}</div>
      <div>$${s.price}</div>
    </div>`
  ).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket #${ticket.ticketNumber} - Lavandería Ohana</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          font-size: 12px;
        }
        .ticket {
          width: 300px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .info {
          margin-bottom: 20px;
        }
        .services {
          margin-bottom: 20px;
        }
        .total {
          font-weight: bold;
          text-align: right;
          border-top: 1px solid black;
          padding-top: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 10px;
        }
        @media print {
          @page {
            margin: 0;
          }
          body {
            margin: 10mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <div class="logo">LAVANDERÍA OHANA</div>
          <div>Servicio profesional de lavandería</div>
        </div>
        
        <div class="info">
          <div><strong>Ticket:</strong> #${ticket.ticketNumber}</div>
          <div><strong>Cliente:</strong> ${ticket.clientName}</div>
          <div><strong>Teléfono:</strong> ${ticket.phoneNumber}</div>
          <div><strong>Fecha:</strong> ${new Date(ticket.createdAt).toLocaleDateString()}</div>
        </div>
        
        <div class="services">
          <div><strong>Servicios:</strong></div>
          ${servicesList}
        </div>
        
        <div class="total">
          <div>TOTAL: $${ticket.totalPrice}</div>
        </div>
        
        <div class="footer">
          <p>Gracias por confiar en Lavandería Ohana</p>
          <p>Para consultas: ohana.laundry@example.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
