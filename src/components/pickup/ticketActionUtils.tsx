
import { Ticket } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
};

export const handleNotifyClient = (ticket: Ticket) => {
  if (ticket) {
    const whatsappMessage = encodeURIComponent(
      `Hola ${ticket.clientName}, su pedido está listo para retirar en Lavandería Ohana.`
    );
    const whatsappUrl = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast.success(`Notificación enviada a ${ticket.clientName}`, {
      description: `Se notificó que su pedido está listo para retirar.`
    });
  } else {
    toast.error('Error', { description: 'Seleccione un ticket primero' });
  }
};

export const handleShareWhatsApp = (ticket: Ticket | undefined, ticketServices: any[]) => {
  if (!ticket) {
    toast.error('Error', { description: 'Seleccione un ticket primero' });
    return;
  }

  let message = `🧼 *LAVANDERÍA OHANA - TICKET* 🧼\n\n`;
  message += `Estimado/a ${ticket.clientName},\n\n`;
  message += `Su pedido está listo para retirar.\n\n`;
  
  if (ticketServices.length > 0) {
    message += `*Detalle de servicios:*\n`;
    ticketServices.forEach(service => {
      message += `- ${service.name} x${service.quantity}: $${service.price.toLocaleString()}\n`;
    });
  }
  
  message += `\n*Total a pagar: $${ticket.totalPrice.toLocaleString()}*\n\n`;
  message += `Gracias por confiar en Lavandería Ohana.`;

  const whatsappUrl = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
  
  toast.success(`Compartiendo ticket con ${ticket.clientName}`);
};

export const generatePrintContent = (ticket: Ticket, ticketServices: any[]) => {
  const formattedDate = formatDate(ticket.createdAt);

  const servicesContent = ticketServices.length > 0 
    ? ticketServices.map(service => 
        `<div class="service-item">
          <span>${service.name} x${service.quantity}</span>
          <span>$ ${(service.price).toLocaleString()}</span>
        </div>`
      ).join('')
    : '<p>No hay servicios registrados</p>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .ticket-info {
          margin-bottom: 20px;
        }
        .ticket-info p {
          margin: 5px 0;
        }
        .services {
          margin-bottom: 20px;
        }
        .service-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        .total {
          font-weight: bold;
          text-align: right;
          margin-top: 20px;
          font-size: 1.2em;
        }
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Lavandería Ohana</h1>
        <p>Ticket de servicio</p>
      </div>
      
      <div class="ticket-info">
        <p><strong>Ticket N°:</strong> ${ticket.ticketNumber || 'N/A'}</p>
        <p><strong>Cliente:</strong> ${ticket.clientName}</p>
        <p><strong>Teléfono:</strong> ${ticket.phoneNumber}</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
      </div>
      
      <h3>Servicios:</h3>
      <div class="services">
        ${servicesContent}
      </div>
      
      <div class="total">
        Total: $ ${ticket.totalPrice.toLocaleString()}
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print();" style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Imprimir Ticket
        </button>
      </div>
    </body>
    </html>
  `;
};
