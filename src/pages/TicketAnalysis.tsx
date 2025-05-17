
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import ActionButtons from '@/components/analytics/ActionButtons';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TicketAnalysis: React.FC = () => {
  const {
    isLoading,
    error,
    analytics,
    dateRange,
    setDateRange,
    exportData
  } = useAnalytics();

  const handleDateChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="mb-2 flex items-center text-blue-600 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Análisis de Tickets</h1>
            <p className="text-gray-500">Análisis detallado y tendencias</p>
          </header>

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <DateRangeSelector 
              from={dateRange.from} 
              to={dateRange.to} 
              onUpdate={handleDateChange} 
            />
            <ActionButtons onExportData={exportData} />
          </div>

          {error ? (
            <ErrorMessage 
              title="Error al cargar datos" 
              message={error.message || "Ocurrió un error al cargar los datos."}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <div className="space-y-8">
              <MetricsSection loading={isLoading} analytics={analytics} />
              
              <Tabs defaultValue="trends">
                <TabsList>
                  <TabsTrigger value="trends">Tendencias</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="comparison">Comparación</TabsTrigger>
                </TabsList>
                
                <TabsContent value="trends" className="mt-6">
                  <ChartTabs loading={isLoading} analytics={analytics} />
                </TabsContent>
                
                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalles por Estado</CardTitle>
                      <CardDescription>Análisis detallado por estado de los tickets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-gray-500">Tickets Pendientes</div>
                          <div className="mt-2 text-3xl font-bold">{analytics?.ticketsByStatus.pending || 0}</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-gray-500">Tickets Listos</div>
                          <div className="mt-2 text-3xl font-bold">{analytics?.ticketsByStatus.ready || 0}</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-gray-500">Tickets Entregados</div>
                          <div className="mt-2 text-3xl font-bold">{analytics?.ticketsByStatus.delivered || 0}</div>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Distribución de Artículos</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Artículo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Cantidad
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {Object.entries(analytics?.itemTypeDistribution || {}).map(([name, value]) => (
                                <tr key={name}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="comparison" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparación de Métodos de Pago</CardTitle>
                      <CardDescription>Análisis de métodos de pago utilizados</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Método de Pago
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad de Tickets
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Porcentaje
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(analytics?.paymentMethodDistribution || {}).map(([method, count]) => {
                              const total = Object.values(analytics?.paymentMethodDistribution || {})
                                .reduce((sum, val) => sum + Number(val), 0);
                              const percentage = total > 0 ? (Number(count) / total) * 100 : 0;
                              
                              const methodName = 
                                method === 'cash' ? 'Efectivo' :
                                method === 'debit' ? 'Débito' :
                                method === 'mercadopago' ? 'MercadoPago' :
                                method === 'cuentadni' ? 'Cuenta DNI' : method;
                              
                              return (
                                <tr key={method}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {methodName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {count}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {percentage.toFixed(2)}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketAnalysis;
