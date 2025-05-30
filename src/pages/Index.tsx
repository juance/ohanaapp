
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  DollarSign,
  Clipboard,
  FileText,
  Award,
  Package2,
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react';
import Layout from '@/components/Layout';

const Index = () => {
  const menuItems = [
    {
      title: 'Dashboard',
      description: 'Panel de control principal',
      href: '/dashboard',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      title: 'Tickets',
      description: 'Crear y gestionar tickets',
      href: '/tickets',
      icon: Clipboard,
      color: 'bg-green-500'
    },
    {
      title: 'Órdenes',
      description: 'Gestionar órdenes pendientes y listas',
      href: '/orders',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Órdenes Pendientes',
      description: 'Ver órdenes que están siendo procesadas',
      href: '/pickup',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Órdenes Entregadas',
      description: 'Historial de órdenes completadas',
      href: '/delivered',
      icon: FileText,
      color: 'bg-emerald-500'
    },
    {
      title: 'Clientes',
      description: 'Gestionar base de datos de clientes',
      href: '/clients',
      icon: Users,
      color: 'bg-indigo-500'
    },
    {
      title: 'Programa de Fidelidad',
      description: 'Gestionar puntos y recompensas',
      href: '/loyalty',
      icon: Award,
      color: 'bg-pink-500'
    },
    {
      title: 'Inventario',
      description: 'Control de productos y suministros',
      href: '/inventory',
      icon: Package2,
      color: 'bg-orange-500'
    },
    {
      title: 'Métricas',
      description: 'Ver estadísticas y rendimiento',
      href: '/metrics',
      icon: TrendingUp,
      color: 'bg-cyan-500'
    },
    {
      title: 'Análisis de Tickets',
      description: 'Análisis detallado de tickets',
      href: '/ticket-analysis',
      icon: BarChart3,
      color: 'bg-violet-500'
    },
    {
      title: 'Gastos',
      description: 'Gestionar gastos operativos',
      href: '/expenses',
      icon: DollarSign,
      color: 'bg-red-500'
    },
    {
      title: 'Comentarios',
      description: 'Ver feedback de clientes',
      href: '/feedback',
      icon: MessageSquare,
      color: 'bg-teal-500'
    },
    {
      title: 'Administración',
      description: 'Configuración del sistema',
      href: '/admin',
      icon: Settings,
      color: 'bg-gray-500'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Lavandería Ohana
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de Gestión Integral
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Card key={item.href} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link to={item.href}>
                  <Button className="w-full">
                    Acceder
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Lavandería Ohana - Sistema de Gestión
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
