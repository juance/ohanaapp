
import React from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminTabs } from '@/components/admin/AdminTabs';
import Layout from '@/components/Layout';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminTools() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <Link to="/dashboard" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Herramientas de Administración</h1>
            <p className="text-gray-500">Gestión completa del sistema</p>
          </div>
          
          <Button 
            variant="destructive" 
            className="mt-4 md:mt-0 flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </header>

        <AdminDashboard />
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Configuración Avanzada</h2>
          <AdminTabs />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Información de Sistema</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-xs overflow-auto">
                {JSON.stringify({
                  timestamp: new Date().toISOString(),
                  localStorage: Object.keys(localStorage).length,
                  sessionStorage: Object.keys(sessionStorage).length,
                  navigator: {
                    onLine: navigator.onLine,
                    userAgent: navigator.userAgent
                  }
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
