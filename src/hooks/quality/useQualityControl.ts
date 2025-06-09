
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';

interface QualityReport {
  id: string;
  ticketId: string;
  ticketNumber: string;
  rating: number;
  notes: string;
  inspector: string;
  date: string;
  photos?: string[];
}

interface CreateQualityReportParams {
  ticketId: string;
  rating: number;
  notes: string;
  inspector: string;
  date: string;
}

export const useQualityControl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Query para tickets pendientes de inspección
  const { data: pendingTickets = [] } = useQuery({
    queryKey: ['pendingInspectionTickets'],
    queryFn: async () => {
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      const qualityReports = JSON.parse(localStorage.getItem('qualityReports') || '[]');
      
      // Filtrar tickets que no han sido inspeccionados
      const inspectedTicketIds = qualityReports.map((report: QualityReport) => report.ticketId);
      return tickets.filter((ticket: any) => 
        ticket.status === 'ready' && !inspectedTicketIds.includes(ticket.id)
      );
    }
  });

  // Query para reportes de calidad
  const { data: qualityReports = [] } = useQuery({
    queryKey: ['qualityReports'],
    queryFn: async () => {
      return JSON.parse(localStorage.getItem('qualityReports') || '[]');
    }
  });

  const createQualityReport = useCallback(async (params: CreateQualityReportParams) => {
    setIsLoading(true);
    try {
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      const ticket = tickets.find((t: any) => t.id === params.ticketId);
      
      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }

      const newReport: QualityReport = {
        id: Date.now().toString(),
        ticketId: params.ticketId,
        ticketNumber: ticket.ticketNumber,
        rating: params.rating,
        notes: params.notes,
        inspector: params.inspector,
        date: params.date
      };

      const existingReports = JSON.parse(localStorage.getItem('qualityReports') || '[]');
      const updatedReports = [...existingReports, newReport];
      
      localStorage.setItem('qualityReports', JSON.stringify(updatedReports));
      
      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['pendingInspectionTickets'] });
      queryClient.invalidateQueries({ queryKey: ['qualityReports'] });
      
      toast.success('Reporte de calidad creado exitosamente');
    } catch (error) {
      console.error('Error creating quality report:', error);
      toast.error('Error al crear reporte de calidad');
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const uploadPhoto = useCallback(async (ticketId: string, file: File) => {
    try {
      // En un sistema real, esto subiría la foto a un servicio de almacenamiento
      // Por ahora, simulamos el proceso
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        
        // Guardar referencia de la foto (en un sistema real sería una URL)
        const qualityPhotos = JSON.parse(localStorage.getItem('qualityPhotos') || '{}');
        if (!qualityPhotos[ticketId]) {
          qualityPhotos[ticketId] = [];
        }
        qualityPhotos[ticketId].push({
          id: Date.now().toString(),
          data: photoData,
          timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('qualityPhotos', JSON.stringify(qualityPhotos));
        toast.success('Foto subida exitosamente');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error al subir la foto');
    }
  }, []);

  return {
    pendingTickets,
    qualityReports,
    createQualityReport,
    uploadPhoto,
    isLoading
  };
};
