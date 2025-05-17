import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { LayoutDashboard, BarChart, LineChart } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Laundry App</h1>
      <p className="text-gray-600 mb-8">Administra tu lavandería de manera eficiente.</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              Panel de Control
            </CardTitle>
            <CardDescription>Vista general del negocio</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Accede a información resumida del negocio. Visualiza tus métricas clave y gráficos de rendimiento.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard">Ver Panel de Control</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Métricas
            </CardTitle>
            <CardDescription>Análisis detallado de tickets</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Analiza el rendimiento de tu negocio con métricas detalladas de ventas, tickets y clientes.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/metrics">Ver Métricas</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Análisis de Tickets
            </CardTitle>
            <CardDescription>Análisis avanzado</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Analiza tendencias y patrones en tus datos. Visualiza información detallada sobre los tickets.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/analysis">Ver Análisis</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Órdenes para Recoger</CardTitle>
            <CardDescription>Gestiona las órdenes listas para recoger</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Visualiza y gestiona las órdenes que están listas para ser recogidas por los clientes.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/pickup-orders">Ver Órdenes</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Crear Ticket</CardTitle>
            <CardDescription>Crea un nuevo ticket de servicio</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Genera un nuevo ticket para registrar un servicio.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/create-ticket">Crear Ticket</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Administra tus clientes</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p>Visualiza, agrega y edita información de tus clientes.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/clients">Ver Clientes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
