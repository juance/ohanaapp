
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart, ShoppingBag, Users, Ticket, Award, Settings, DollarSign, FileText, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  const features = [
    {
      title: 'Panel de Control',
      description: 'Visualiza métricas y estadísticas importantes',
      icon: <BarChart className="h-8 w-8 text-blue-500" />,
      path: '/dashboard',
    },
    {
      title: 'Tickets',
      description: 'Genera y gestiona tickets de servicio',
      icon: <Ticket className="h-8 w-8 text-indigo-500" />,
      path: '/tickets',
    },
    {
      title: 'Ordenes Pendientes',
      description: 'Gestiona las órdenes pendientes de entrega',
      icon: <ShoppingBag className="h-8 w-8 text-yellow-500" />,
      path: '/pickup',
    },
    {
      title: 'Ordenes Entregadas',
      description: 'Revisa el historial de órdenes entregadas',
      icon: <FileText className="h-8 w-8 text-green-500" />,
      path: '/delivered',
    },
    {
      title: 'Clientes',
      description: 'Administra la información de los clientes',
      icon: <Users className="h-8 w-8 text-purple-500" />,
      path: '/clients',
    },
    {
      title: 'Programa de Fidelidad',
      description: 'Gestiona puntos y recompensas para clientes',
      icon: <Award className="h-8 w-8 text-orange-500" />,
      path: '/loyalty',
    },
    {
      title: 'Inventario',
      description: 'Control y gestión de productos e insumos',
      icon: <Package className="h-8 w-8 text-emerald-500" />,
      path: '/inventory',
    },
    {
      title: 'Análisis de Tickets',
      description: 'Reportes y analíticas sobre los tickets',
      icon: <FileText className="h-8 w-8 text-cyan-500" />,
      path: '/analysis',
    },
    {
      title: 'Gastos',
      description: 'Control y registro de gastos del negocio',
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      path: '/expenses',
    },
    {
      title: 'Administración',
      description: 'Configuraciones y herramientas del sistema',
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      path: '/administration',
    },
    {
      title: 'Comentarios',
      description: 'Gestiona comentarios de clientes',
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      path: '/feedback',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Sistema de Gestión</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.path} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {feature.icon}
                    <span>{feature.title}</span>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-3">
                  <Button asChild className="w-full">
                    <Link to={feature.path} className="flex items-center justify-center">
                      Acceder
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            © 2023 Lavandería Ohana. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
