
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { demandPredictionService, DemandAnalysis } from '@/lib/analytics/demandPrediction';
import { profitabilityAnalysisService, ProfitabilityAnalysis } from '@/lib/analytics/profitabilityAnalysis';
import { backupService } from '@/lib/services/backupService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/lib/toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ExecutiveDashboardProps {
  className?: string;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ className }) => {
  const [demandData, setDemandData] = useState<DemandAnalysis | null>(null);
  const [profitabilityData, setProfitabilityData] = useState<ProfitabilityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [demand, profitability] = await Promise.all([
        demandPredictionService.predictDemand(7),
        profitabilityAnalysisService.analyzeProfitability(selectedPeriod)
      ]);

      setDemandData(demand);
      setProfitabilityData(profitability);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Error al cargar datos analíticos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      await backupService.downloadBackup();
      toast.success('Reporte exportado exitosamente');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error al exportar reporte');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Ejecutivo</h1>
          <p className="text-muted-foreground">
            Análisis avanzado y predicciones para la toma de decisiones
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={(value: 'week' | 'month') => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semanal</SelectItem>
              <SelectItem value="month">Mensual</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="profitability">Rentabilidad</TabsTrigger>
          <TabsTrigger value="demand">Predicción de Demanda</TabsTrigger>
          <TabsTrigger value="alerts">Alertas y Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(profitabilityData?.current.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  vs período anterior: {formatCurrency(profitabilityData?.previous.totalRevenue || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margen de Ganancia</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(profitabilityData?.current.profitMargin || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  vs anterior: {formatPercentage(profitabilityData?.previous.profitMargin || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(profitabilityData?.current.avgTicketValue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  vs anterior: {formatCurrency(profitabilityData?.previous.avgTicketValue || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predicción Próximos 7 días</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {demandData?.predictions.reduce((sum, p) => sum + p.predictedVolume, 0) || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  servicios estimados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Predicción de Demanda */}
          <Card>
            <CardHeader>
              <CardTitle>Predicción de Demanda - Próximos 7 días</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={demandData?.predictions || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: es })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: es })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predictedVolume" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Volumen Predicho"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#82ca9d" 
                    strokeWidth={1}
                    name="Confianza %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6">
          {/* Análisis de Rentabilidad por Servicio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rentabilidad por Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    {
                      name: 'Valet',
                      revenue: profitabilityData?.current.breakdownByService.valet.revenue || 0,
                      profit: profitabilityData?.current.breakdownByService.valet.profit || 0
                    },
                    {
                      name: 'Tintorería',
                      revenue: profitabilityData?.current.breakdownByService.drycleaning.revenue || 0,
                      profit: profitabilityData?.current.breakdownByService.drycleaning.profit || 0
                    },
                    {
                      name: 'Lavandería',
                      revenue: profitabilityData?.current.breakdownByService.laundry.revenue || 0,
                      profit: profitabilityData?.current.breakdownByService.laundry.profit || 0
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Ingresos" />
                    <Bar dataKey="profit" fill="#82ca9d" name="Ganancia" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Valet', value: profitabilityData?.current.breakdownByService.valet.revenue || 0 },
                        { name: 'Tintorería', value: profitabilityData?.current.breakdownByService.drycleaning.revenue || 0 },
                        { name: 'Lavandería', value: profitabilityData?.current.breakdownByService.laundry.revenue || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Detalladas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(profitabilityData?.current.breakdownByService || {}).map(([service, data]) => (
              <Card key={service}>
                <CardHeader>
                  <CardTitle className="capitalize">{service}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ingresos:</span>
                    <span className="font-semibold">{formatCurrency(data.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costos:</span>
                    <span>{formatCurrency(data.estimatedCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ganancia:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(data.profit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margen:</span>
                    <span className={`font-semibold ${data.margin > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                      {formatPercentage(data.margin)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volumen:</span>
                    <span>{data.volume} servicios</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demand" className="space-y-6">
          {/* Recomendaciones de Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {Object.entries(demandData?.recommendedStaffing || {}).map(([date, staff]) => (
                  <div key={date} className="text-center p-3 border rounded-lg">
                    <div className="text-sm font-medium">
                      {format(new Date(date), 'dd/MM', { locale: es })}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{staff}</div>
                    <div className="text-xs text-muted-foreground">personal</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones de Inventario */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demandData?.inventoryRecommendations.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{item.item}</span>
                      <div className="text-sm text-muted-foreground">
                        Stock actual: {item.current}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">
                        Recomendado: {item.recommended}
                      </div>
                      {item.current < item.recommended && (
                        <div className="text-sm text-orange-600">
                          Reponer: {item.recommended - item.current}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profitabilityData?.alerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                      alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        alert.type === 'critical' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <span className="font-medium">{alert.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profitabilityData?.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <Target className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Días Pico Predichos */}
          {demandData?.peakDays && demandData.peakDays.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Días de Alta Demanda Predichos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {demandData.peakDays.map((date, index) => (
                    <div key={index} className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="font-medium text-orange-800">
                        {format(new Date(date), 'dd/MM/yyyy', { locale: es })}
                      </div>
                      <div className="text-sm text-orange-600">Alta demanda esperada</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;
