
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClientData } from '@/hooks/useClientData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface ClientsProps {
  embedded?: boolean;
}

const Clients: React.FC<ClientsProps> = ({ embedded = false }) => {
  const { clients, isLoading, error } = useClientData();
  
  const content = (
    <>
      {!embedded && (
        <header className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
          <p className="text-gray-500">Clientes</p>
        </header>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando datos de clientes...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
          <p className="text-red-700">{error.message}</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Valets Acumulados</TableHead>
                <TableHead>Valets Gratis</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Frecuencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.phoneNumber}</TableCell>
                  <TableCell>{client.valetsCount}</TableCell>
                  <TableCell>{client.freeValets}</TableCell>
                  <TableCell>
                    {client.lastVisit ? format(new Date(client.lastVisit), 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {client.visitFrequency ? `${client.visitFrequency} días` : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
  
  if (embedded) {
    return content;
  }
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Clients;
