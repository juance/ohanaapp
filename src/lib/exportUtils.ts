
import { saveAs } from 'file-saver';
import { ClientVisit } from './types';

/**
 * Export data as CSV file
 */
export function exportToCSV(data: any[], filename: string): void {
  // Convert array of objects to CSV
  const headers = Object.keys(data[0] || {}).join(',');
  const rows = data.map(item => 
    Object.values(item)
      .map(value => formatCSVValue(value))
      .join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
}

/**
 * Format a value for CSV export
 */
function formatCSVValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  // Format dates
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  // Convert to string and escape quotes
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Export clients data to CSV
 */
export function exportClientsToCSV(clients: ClientVisit[]): void {
  // Format clients data for export
  const formattedData = clients.map(client => ({
    Nombre: client.clientName,
    Teléfono: client.phoneNumber,
    'Cantidad de Visitas': client.visitCount,
    'Última Visita': client.lastVisit,
    'Puntos de Lealtad': client.loyaltyPoints || 0,
    'Servicios Gratuitos': client.freeValets || 0,
    'Servicios Acumulados': client.valetsCount || 0
  }));
  
  exportToCSV(formattedData, `clientes_${new Date().toISOString().split('T')[0]}.csv`);
}
