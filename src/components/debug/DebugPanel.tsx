import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';

interface DebugPanelProps {
  tickets: Ticket[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ tickets, isLoading, error, refetch }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-6 border rounded-lg overflow-hidden"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full items-center justify-between p-4"
        >
          <div className="flex items-center">
            <Bug className="h-4 w-4 mr-2 text-yellow-600" />
            <span className="font-medium">Panel de Depuración</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estado de la Consulta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Cargando:</span>{' '}
                    <span className={isLoading ? 'text-yellow-600' : 'text-green-600'}>
                      {isLoading ? 'Sí' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Error:</span>{' '}
                    <span className={error ? 'text-red-600' : 'text-green-600'}>
                      {error ? 'Sí' : 'No'}
                    </span>
                  </div>
                  {error && (
                    <div className="text-red-600 text-xs whitespace-pre-wrap">
                      {JSON.stringify(error, null, 2)}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Tickets cargados:</span>{' '}
                    <span className={tickets.length > 0 ? 'text-green-600' : 'text-yellow-600'}>
                      {tickets.length}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="mt-2"
                  >
                    Recargar Datos
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Datos de Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length > 0 ? (
                  <div className="space-y-2 text-xs">
                    <div className="max-h-40 overflow-y-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr>
                            <th className="p-1">ID</th>
                            <th className="p-1">Número</th>
                            <th className="p-1">Estado</th>
                            <th className="p-1">Cliente</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tickets.map((ticket) => (
                            <tr key={ticket.id} className="border-t">
                              <td className="p-1 truncate max-w-[80px]">{ticket.id}</td>
                              <td className="p-1">{ticket.ticketNumber}</td>
                              <td className="p-1">{ticket.status}</td>
                              <td className="p-1 truncate max-w-[100px]">{ticket.clientName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2">
                      <details>
                        <summary className="cursor-pointer text-blue-600">
                          Ver datos completos (JSON)
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(tickets, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                ) : (
                  <div className="text-yellow-600">No hay tickets para mostrar</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">URL:</span> {window.location.href}
                </div>
                <div>
                  <span className="font-medium">Navegador:</span> {navigator.userAgent}
                </div>
                <div>
                  <span className="font-medium">Fecha/Hora:</span>{' '}
                  {new Date().toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Resolución:</span>{' '}
                  {window.innerWidth}x{window.innerHeight}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DebugPanel;
