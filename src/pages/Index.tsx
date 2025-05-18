import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-8">
      <Navbar />
      
      <main className="md:ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Bienvenido a Ohana Laundry</h1>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Visualiza métricas de ventas y desempeño</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>Accede a información resumida del negocio.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/dashboard">Ver Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Métricas</CardTitle>
              <CardDescription>Análisis detallado de tickets</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>Analiza el rendimiento de tu negocio.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/metrics">Ver Métricas</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Análisis</CardTitle>
              <CardDescription>Análisis avanzado</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>Analiza tendencias y patrones en tus datos.</p>
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
          
          {/* Add diagnostics links */}
          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="text-lg font-semibold mb-2">Herramientas de diagnóstico</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left" 
                onClick={() => navigate('/diagnostics')}
              >
                Diagnosticar sistema
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left" 
                onClick={() => navigate('/supabase-test')}
              >
                Probar conexión Supabase
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
